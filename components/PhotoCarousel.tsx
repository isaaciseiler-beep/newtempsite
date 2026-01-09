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

const CARD_W = 420; // photos-only: wider than other carousels
const CARD_H = 300; // consistent height
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

  // shuffle once per page load (client render)
  const shuffledItems = React.useMemo(() => shuffle(items), [items]);

  const updateNav = React.useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    const sl = el.scrollLeft;

    setCanPrev(sl > 2);
    setCanNext(sl < maxScrollLeft - 2);
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

  const scrollByCard = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (CARD_W + GAP), behavior: "smooth" });
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
            scroll-smooth
            snap-x snap-mandatory
            touch-pan-x
            overscroll-x-contain
            [-ms-overflow-style:none] [scrollbar-width:none]
          "
          style={{ scrollPaddingLeft: 24, scrollPaddingRight: 24 }}
        >
          {/* hide scrollbar (webkit) */}
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {shuffledItems.map((item, i) => {
            const key = item.image ?? `${item.location}-${i}`;

            const CardInner = (
              <article
                className="flex-shrink-0 snap-start"
                style={{ width: CARD_W }}
              >
                <div
                  className="relative w-full overflow-hidden rounded-2xl"
                  style={{ height: CARD_H }}
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.location}
                      fill
                      // allow vertical + horizontal images without forcing a crop:
                      // vertical images will letterbox; horizontals fill more
                      className="object-contain"
                      quality={95}
                      // match actual render width so retina gets high-res srcset
                      sizes="(min-width: 640px) 420px, 88vw"
                      priority={i < 2}
                    />
                  ) : (
                    <div className="h-full w-full bg-neutral-200" />
                  )}

                  {/* location pill inside bottom-right */}
                  <div className="absolute bottom-3 right-3 z-20">
                    <div className="rounded-full bg-black/65 px-3 py-1 text-[11px] font-medium text-white/85 backdrop-blur-sm">
                      {item.location}
                    </div>
                  </div>
                </div>
              </article>
            );

            if (!item.href) return <div key={key}>{CardInner}</div>;

            return (
              <Link
                key={key}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-visible:outline-none"
              >
                {CardInner}
              </Link>
            );
          })}
        </div>

        {canPrev && (
          <button
            type="button"
            aria-label="previous"
            onClick={() => scrollByCard(-1)}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-transparent p-2 text-white/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <Chevron direction="left" />
          </button>
        )}

        {canNext && (
          <button
            type="button"
            aria-label="next"
            onClick={() => scrollByCard(1)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-transparent p-2 text-white/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <Chevron direction="right" />
          </button>
        )}
      </div>
    </div>
  );
}
