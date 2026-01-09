// components/PhotoCarousel.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

export type PhotoItem = {
  image?: string;
  location: string;
  href?: string;
};

const CARD_H = 320; // all photos same height
const GAP = 16;

function Chevron({ direction }: { direction: "left" | "right" }) {
  const d =
    direction === "left" ? "M15 6L8.5 12 15 18" : "M9 6l6.5 6L9 18";
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-6 w-6 filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.28)]"
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PhotoCarousel({ items }: { items: PhotoItem[] }) {
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(false);

  // shuffle once per page load
  const shuffledItems = React.useMemo(() => shuffle(items), [items]);

  const updateNav = React.useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const sl = el.scrollLeft;
    setCanPrev(sl > 2);
    setCanNext(sl < max - 2);
  }, []);

  React.useEffect(() => {
    updateNav();
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => updateNav();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => updateNav());
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [updateNav, shuffledItems.length]);

  const scrollByOne = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;

    // scroll by the width of the first card (+ gap). widths vary, so measure.
    const first = el.querySelector<HTMLElement>("[data-photo-card]");
    const step = (first?.offsetWidth ?? 360) + GAP;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (shuffledItems.length === 0) {
    return <div className="text-sm text-neutral-50/60">No photos yet.</div>;
  }

  return (
    <div className="relative">
      <div className="relative -mx-6 sm:-mx-10">
        <div
          ref={scrollerRef}
          className="
            flex gap-4
            overflow-x-auto overflow-y-hidden
            px-6 sm:px-10
            snap-x snap-mandatory
            touch-pan-x
            overscroll-x-contain
            scroll-smooth
            [-ms-overflow-style:none] [scrollbar-width:none]
          "
          style={{ scrollPaddingLeft: 24, scrollPaddingRight: 24 }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {shuffledItems.map((item, i) => {
            const key = item.image ?? `${item.location}-${i}`;

            const Card = (
              <article
                data-photo-card
                className="
                  relative flex-shrink-0 snap-start
                  overflow-hidden rounded-2xl
                  border border-black/10
                  bg-white
                  shadow-[0_0_20px_rgba(0,0,0,0.14)]
                "
                style={{
                  height: CARD_H,
                  width: "fit-content", // variable width
                }}
              >
                {/* image: fixed height, auto width */}
                <div className="relative h-full">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.location}
                      // provide a big intrinsic box, then size it via CSS:
                      width={2400}
                      height={1600}
                      quality={95}
                      priority={i < 2}
                      sizes="(min-width: 640px) 70vw, 92vw"
                      className="h-full w-auto object-cover"
                      style={{ display: "block" }}
                    />
                  ) : (
                    <div className="h-full w-[420px] bg-neutral-200" />
                  )}

                  {/* pill INSIDE bottom-right (not below the frame) */}
                  <div className="absolute bottom-3 right-3 z-20">
                    <div className="rounded-full bg-black/65 px-3 py-1 text-[11px] font-medium text-white/85 backdrop-blur-sm">
                      {item.location}
                    </div>
                  </div>
                </div>
              </article>
            );

            if (!item.href) return <div key={key}>{Card}</div>;

            return (
              <Link
                key={key}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-visible:outline-none"
              >
                {Card}
              </Link>
            );
          })}
        </div>

        {canPrev && (
          <button
            type="button"
            aria-label="previous"
            onClick={() => scrollByOne(-1)}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-transparent p-2 text-white/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <Chevron direction="left" />
          </button>
        )}

        {canNext && (
          <button
            type="button"
            aria-label="next"
            onClick={() => scrollByOne(1)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-transparent p-2 text-white/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <Chevron direction="right" />
          </button>
        )}
      </div>
    </div>
  );
}
