// components/ProjectModal.tsx (drop-in replacement)
"use client";

import Image from "next/image";
import { useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type ProjectTemplate = {
  slug: string;
  title: string;
  subtitle?: string;
  image?: string; // header image
  source?: string;
  body: ReactNode;
};

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    slug: "ops-automation-stack",
    title: "Ops Automation Stack",
    subtitle: "How I build small systems that remove repetitive work.",
    source: "Project",
    image: "https://pub-41d52824b0bb4f44898c39e1c3c63cb8.r2.dev/press/pulse.jpg",
    body: (
      <div className="space-y-6">
        <p>
          A lightweight pattern I use to turn messy workflows into reliable
          pipelines: capture signals, normalize them, route them, and keep a
          human-in-the-loop review step.
        </p>
        <div>
          <h3 className="text-lg font-semibold">What it does</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-white/85">
            <li>Collects inputs from email, forms, and notes</li>
            <li>Standardizes fields into one schema</li>
            <li>Automates follow-ups, reminders, and status updates</li>
            <li>Logs everything for auditability</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    slug: "chatgpt-local-lab",
    title: "ChatGPT Local Lab",
    subtitle: "Workshops + experiments with educators in Taiwan.",
    source: "Project",
    image:
      "https://pub-41d52824b0bb4f44898c39e1c3c63cb8.r2.dev/press/study-mode.jpg",
    body: (
      <div className="space-y-6">
        <p>
          Practical sessions focused on classroom workflows: planning,
          differentiation, feedback, and admin tasks.
        </p>
      </div>
    ),
  },
  {
    slug: "job-signal",
    title: "Job Signal",
    subtitle: "Tracking roles, follow-ups, and outreach with one source of truth.",
    source: "Project",
    image:
      "https://pub-41d52824b0bb4f44898c39e1c3c63cb8.r2.dev/press/100chats.jpg",
    body: (
      <div className="space-y-6">
        <p>
          A personal system for managing applications and networking without
          losing context. Designed to be fast to update and easy to audit.
        </p>
      </div>
    ),
  },
  {
    slug: "photo-map",
    title: "Portfolio Photo Map",
    subtitle: "A map-first way to browse travel + photography.",
    source: "Project",
    image:
      "https://pub-41d52824b0bb4f44898c39e1c3c63cb8.r2.dev/press/wustl.jpg",
    body: (
      <div className="space-y-6">
        <p>
          A UI pattern for browsing large photo libraries by place, then
          narrowing by theme.
        </p>
      </div>
    ),
  },
  {
    slug: "this-site",
    title: "This Site",
    subtitle: "A one-page portfolio with a ‘window’ modal for project write-ups.",
    source: "Project",
    image:
      "https://pub-41d52824b0bb4f44898c39e1c3c63cb8.r2.dev/press/truman.jpg",
    body: (
      <div className="space-y-6">
        <p>
          Keep the homepage fast and visual, while letting deeper write-ups open
          without navigating away.
        </p>
      </div>
    ),
  },
];

function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

export default function ProjectModal() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const slug = searchParams.get("project");
  const project = useMemo(
    () => (slug ? PROJECT_TEMPLATES.find((p) => p.slug === slug) : undefined),
    [slug]
  );

  const isOpen = Boolean(project);
  useBodyScrollLock(isOpen);

  const close = () => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("project");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" aria-modal="true" role="dialog">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-md"
        onMouseDown={close}
      />

      {/* bigger frame */}
      <div className="relative mx-4 w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/90 shadow-[0_0_70px_rgba(0,0,0,0.6)]">
        {/* header image inside */}
        {project.image && (
          <div className="relative h-52 sm:h-64 w-full">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/75 via-neutral-950/25 to-transparent" />
          </div>
        )}

        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-7 py-6">
          <div className="min-w-0">
            {project.source && (
              <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
                {project.source}
              </div>
            )}
            <h2 className="mt-2 truncate text-2xl sm:text-3xl font-semibold tracking-tight">
              {project.title}
            </h2>
            {project.subtitle && (
              <p className="mt-1 text-sm text-white/65">{project.subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={close}
            className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
            aria-label="close"
          >
            ×
          </button>
        </div>

        {/* scrollable content area (panel stays fixed) */}
        <div className="max-h-[70vh] overflow-y-auto px-7 py-7">
          <div className="prose prose-invert max-w-none">{project.body}</div>
        </div>
      </div>
    </div>
  );
}
