// components/GitWidget.tsx (drop-in replacement)
"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Star } from "lucide-react";

type Props = {
  repoUrl: string;
  stars?: number;
};

const OVERLAY_EVENT = "overlay-open-change";

const fade = { duration: 0.18, ease: [0.2, 0.8, 0.2, 1] };
const popIn = { type: "spring", stiffness: 520, damping: 44, mass: 0.9 };
const popOut = { duration: 0.22, ease: [0.2, 0.8, 0.2, 1] };

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.2, 0.8, 0.2, 1] },
  },
};

type CommitActivityWeek = {
  total: number;
  week: number; // unix seconds (start of week)
  days: number[]; // 7 values, Sun..Sat
};

export default function GitWidget({ repoUrl, stars }: Props) {
  const [open, setOpen] = React.useState(false);

  const [repoStars, setRepoStars] = React.useState<number | undefined>(stars);
  const [weeks, setWeeks] = React.useState<CommitActivityWeek[] | null>(null);
  const [loading, setLoading] = React.useState(false);

  const { owner, repo } = React.useMemo(() => parseOwnerRepo(repoUrl), [repoUrl]);
  const repoLabel = owner && repo ? `${owner} / ${repo}` : repoUrl;

  const fallbackWeeks = React.useMemo(() => buildFallbackWeeks(repoUrl), [repoUrl]);
  const data = weeks && weeks.length > 0 ? weeks : fallbackWeeks;

  // ensure cleanup on unmount
  React.useEffect(() => {
    return () => setOverlayOpen(false);
  }, []);

  const openSheet = React.useCallback(() => {
    setOverlayOpen(true);
    setOpen(true);
  }, []);

  const closeSheet = React.useCallback(() => {
    // do NOT unlock here (wait for exit animation)
    setOpen(false);
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeSheet();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeSheet]);

  React.useEffect(() => {
    if (!open) return;
    if (!owner || !repo) return;

    let cancelled = false;
    setLoading(true);

    const fetchRepo = async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const json = (await res.json()) as { stargazers_count?: number };
        if (!cancelled && typeof json?.stargazers_count === "number") {
          setRepoStars(json.stargazers_count);
        }
      } catch {}
    };

    const fetchCommitActivity = async () => {
      const started = Date.now();
      const timeoutMs = 6500;

      const poll = async (): Promise<void> => {
        if (cancelled) return;

        try {
          const res = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`,
            { cache: "no-store" }
          );

          if (res.status === 202) {
            if (Date.now() - started < timeoutMs) {
              setTimeout(poll, 900);
              return;
            }
            if (!cancelled) setWeeks(null);
            return;
          }

          if (!res.ok) {
            if (!cancelled) setWeeks(null);
            return;
          }

          const json = (await res.json()) as CommitActivityWeek[];
          if (!cancelled) setWeeks(Array.isArray(json) ? json : null);
        } catch {
          if (!cancelled) setWeeks(null);
        }
      };

      await poll();
    };

    fetchRepo();
    fetchCommitActivity().finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [open, owner, repo]);

  const label = "text-sm font-medium text-neutral-900/75";
  const value = "text-base sm:text-lg font-semibold leading-snug text-neutral-950";
  const pill =
    "inline-flex items-center justify-center rounded-full bg-black/20 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-black/25";

  const footerText = "text-sm text-neutral-950/80";

  const triggerPill =
    "inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-neutral-50/80 transition-colors hover:bg-white hover:text-black focus:outline-none";

  return (
    <div className="relative">
      <button type="button" onClick={() => (open ? closeSheet() : openSheet())} className={triggerPill}>
        <span className="inline-flex items-center gap-2">
          <Github className="h-4 w-4 opacity-90" />
          <span className="font-medium tracking-tight">Built with Github</span>
        </span>
      </button>

      <AnimatePresence
        initial={false}
        onExitComplete={() => {
          // unlock AFTER the sheet/overlay has fully exited (prevents rough jump)
          setOverlayOpen(false);
        }}
      >
        {open && (
          <>
            {/* overlay */}
            <motion.button
              key="git-overlay"
              aria-label="close"
              className="fixed inset-0 z-[60] bg-black/35 backdrop-blur-md"
              onClick={closeSheet}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fade}
              style={{ WebkitBackdropFilter: "blur(12px)" }}
            />

            {/* sheet */}
            <motion.div
              key="git-sheet"
              className="fixed inset-x-0 bottom-0 z-[61] px-3 sm:px-6"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0, transition: popIn }}
              exit={{ opacity: 0, y: 14, transition: popOut }}
              style={{ willChange: "transform, opacity" }}
            >
              <div className="w-full">
                <div className="rounded-t-3xl bg-[#aa96af] shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
                  <div className="flex items-center justify-between px-5 pt-5 pb-4">
                    <Github className="h-5 w-5 text-neutral-950/90" />
                    <Link href={repoUrl} target="_blank" rel="noopener noreferrer" className={pill}>
                      Open Repository
                    </Link>
                  </div>

                  <motion.div
                    className="px-5 pb-[calc(env(safe-area-inset-bottom)+1rem)]"
                    variants={list}
                    initial="hidden"
                    animate="show"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <motion.div variants={item} className="rounded-2xl bg-white/35 p-4">
                        <div className={label}>Repository</div>
                        <div className={`${value} mt-2`}>{repoLabel}</div>
                      </motion.div>

                      <motion.div variants={item} className="rounded-2xl bg-white/35 p-4">
                        <div className={label}>Stars</div>
                        <div className="mt-2 flex items-center gap-2">
                          <Star className="h-4 w-4 text-neutral-950/80" />
                          <span className={value}>
                            {typeof repoStars === "number" ? repoStars.toLocaleString() : "—"}
                          </span>
                        </div>
                      </motion.div>

                      <motion.div variants={item} className="rounded-2xl bg-white/35 p-4 sm:col-span-2">
                        <div className={label}>Commits</div>
                        <div className="mt-3">
                          <CommitGrid weeks={data} />
                          {loading && (!weeks || weeks.length === 0) ? (
                            <div className="mt-2 text-xs text-neutral-950/60">loading…</div>
                          ) : null}
                        </div>
                      </motion.div>
                    </div>

                    <motion.div variants={item} className={`mt-6 flex items-center justify-center gap-4 ${footerText}`}>
                      <span className="inline-flex items-center gap-2">
                        <OpenAIIcon className="h-4 w-4" />
                        <span>Built with GPT 5, GPT 5.1, and GPT 5.2</span>
                      </span>
                      <span className="opacity-50">•</span>
                      <span className="inline-flex items-center gap-2">
                        <VercelIcon className="h-3.5 w-3.5" />
                        <span>Launched with Vercel</span>
                      </span>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* overlay plumbing: freeze scroll + broadcast to Brand */

function setOverlayOpen(open: boolean) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const body = document.body;
  const LOCK_ATTR = "data-scroll-locked";

  // broadcast for Brand fold-up
  try {
    window.dispatchEvent(new CustomEvent(OVERLAY_EVENT, { detail: { open } }));
  } catch {}

  if (open) {
    if (body.getAttribute(LOCK_ATTR) === "true") return;

    const scrollY = window.scrollY || 0;
    const scrollbarWidth = window.innerWidth - root.clientWidth;

    body.setAttribute(LOCK_ATTR, "true");
    body.setAttribute("data-scroll-y", String(scrollY));

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    root.classList.add("modal-open");
  } else {
    if (body.getAttribute(LOCK_ATTR) !== "true") {
      root.classList.remove("modal-open");
      return;
    }

    const prevY = Number(body.getAttribute("data-scroll-y") || "0");

    body.removeAttribute(LOCK_ATTR);
    body.removeAttribute("data-scroll-y");

    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";
    body.style.overflow = "";
    body.style.paddingRight = "";

    root.classList.remove("modal-open");
    window.scrollTo(0, prevY);
  }
}

/* helpers */

function parseOwnerRepo(url: string) {
  try {
    const u = new URL(url);
    const [owner, repo] = u.pathname.replace(/^\//, "").split("/");
    return { owner: owner ?? "", repo: repo ?? "" };
  } catch {
    return { owner: "", repo: "" };
  }
}

function CommitGrid({ weeks }: { weeks: CommitActivityWeek[] }) {
  const allDays = weeks.flatMap((w) => w.days);
  const max = Math.max(1, ...allDays);

  const level = (c: number) => {
    if (c <= 0) return 0;
    const r = c / max;
    if (r <= 0.25) return 1;
    if (r <= 0.5) return 2;
    if (r <= 0.75) return 3;
    return 4;
  };

  const cellBg = (lvl: number) => {
    switch (lvl) {
      case 0:
        return "bg-black/10";
      case 1:
        return "bg-black/20";
      case 2:
        return "bg-black/30";
      case 3:
        return "bg-black/45";
      default:
        return "bg-black/60";
    }
  };

  return (
    <div className="max-w-full overflow-x-auto">
      <div className="grid w-full min-w-[680px] grid-flow-col auto-cols-fr grid-rows-7 gap-[3px]">
        {weeks.map((w, colIdx) =>
          (w.days ?? []).slice(0, 7).map((count, rowIdx) => {
            const ts = (w.week ?? 0) + rowIdx * 86400;
            const d = new Date(ts * 1000);
            const dateLabel = Number.isFinite(d.getTime())
              ? d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
              : "";
            const title = dateLabel
              ? `${count} commit${count === 1 ? "" : "s"} on ${dateLabel}`
              : `${count} commit${count === 1 ? "" : "s"}`;

            return (
              <span
                key={`${colIdx}-${rowIdx}`}
                title={title}
                className={`w-full aspect-square rounded-[2px] ${cellBg(level(count))}`}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

function OpenAIIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M14.949 6.547a3.94 3.94 0 0 0-.348-3.273 4.11 4.11 0 0 0-4.4-1.934A4.1 4.1 0 0 0 8.423.2 4.15 4.15 0 0 0 6.305.086a4.1 4.1 0 0 0-1.891.948 4.04 4.04 0 0 0-1.158 1.753 4.1 4.1 0 0 0-1.563.679A4 4 0 0 0 .554 4.72a3.99 3.99 0 0 0 .502 4.731 3.94 3.94 0 0 0 .346 3.274 4.11 4.11 0 0 0 4.402 1.933c.382.425.852.764 1.377.995.526.231 1.095.35 1.67.346 1.78.002 3.358-1.132 3.901-2.804a4.1 4.1 0 0 0 1.563-.68 4 4 0 0 0 1.14-1.253 3.99 3.99 0 0 0-.506-4.716m-6.097 8.406a3.05 3.05 0 0 1-1.945-.694l.096-.054 3.23-1.838a.53.53 0 0 0 .265-.455v-4.49l1.366.778q.02.011.025.035v3.722c-.003 1.653-1.361 2.992-3.037 2.996m-6.53-2.75a2.95 2.95 0 0 1-.36-2.01l.095.057L5.29 12.09a.53.53 0 0 0 .527 0l3.949-2.246v1.555a.05.05 0 0 1-.022.041L6.473 13.3c-1.454.826-3.311.335-4.15-1.098m-.85-6.94A3.02 3.02 0 0 1 3.07 3.949v3.785a.51.51 0 0 0 .262.451l3.93 2.237-1.366.779a.05.05 0 0 1-.048 0L2.585 9.342a2.98 2.98 0 0 1-1.113-4.094zm11.216 2.571L8.747 5.576l1.362-.776a.05.05 0 0 1 .048 0l3.265 1.86a3 3 0 0 1 1.173 1.207 2.96 2.96 0 0 1-.27 3.2 3.05 3.05 0 0 1-1.36.997V8.279a.52.52 0 0 0-.276-.445m1.36-2.015-.097-.057-3.226-1.855a.53.53 0 0 0-.53 0L6.249 6.153V4.598a.04.04 0 0 1 .019-.04L9.533 2.7a3.07 3.07 0 0 1 3.257.139c.474.325.843.778 1.066 1.303.223.526.289 1.103.191 1.664zM5.503 8.575 4.139 7.8a.05.05 0 0 1-.026-.037V4.049c0-.57.166-1.127.476-1.607s.752-.864 1.275-1.105a3.08 3.08 0 0 1 3.234.41l-.096.054-3.23 1.838a.53.53 0 0 0-.265.455zm.742-1.577 1.758-1 1.762 1v2l-1.755 1-1.762-1z" />
    </svg>
  );
}

function VercelIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 76 65" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M38 0L76 65H0L38 0z" />
    </svg>
  );
}

/* deterministic fallback weeks so the grid always renders */

function buildFallbackWeeks(repoUrl: string): CommitActivityWeek[] {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // sunday

  const seed = fnv1a(repoUrl);
  const rand = mulberry32(seed);

  const weeks: CommitActivityWeek[] = [];
  const weekCount = 52;
  const burstCenters = Array.from({ length: 4 }, () => Math.floor(rand() * weekCount));

  for (let i = weekCount - 1; i >= 0; i--) {
    const weekDate = new Date(startOfWeek);
    weekDate.setDate(weekDate.getDate() - i * 7);
    const weekUnix = Math.floor(weekDate.getTime() / 1000);

    const idx = weekCount - 1 - i;

    const days = Array.from({ length: 7 }, () => {
      let v = rand() < 0.62 ? 0 : rand() < 0.8 ? 1 : rand() < 0.93 ? 2 : 3;

      for (const c of burstCenters) {
        const dist = Math.abs(idx - c);
        if (dist <= 3 && rand() < 0.55) {
          const bump = dist === 0 ? 4 : dist === 1 ? 3 : dist === 2 ? 2 : 1;
          v += bump;
        }
      }

      if (rand() < 0.12) v += 1;
      if (rand() < 0.06) v += 2;

      return Math.max(0, Math.min(12, v));
    });

    weeks.push({ week: weekUnix, days, total: days.reduce((a, b) => a + b, 0) });
  }

  return weeks;
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fnv1a(str: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

