// components/PhotoCarousel.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

export type PhotoItem = {
  image?: string;
  location: string;
  href?: string;
};

/**
 * photos section only:
 * +50% height, -20% width
 */
const CARD_WIDTH = 256; // was ~320
const CARD_GAP = 16;

function Chevron({ direction }: { direction: "left" | "right" }) {
  // narrow, elongated chevron (no stem)
  const d =
    direction === "left"
      ? "M15 6L8.5 12 15 18"
      : "M9 6l6.5 6L9 18";

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

export default function PhotoCarousel({ items }: { items: PhotoItem[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  const maxIndex = Math.max(0, items.length - 1);
  const canPrev = index > 0;
  const canNext = index < maxIndex;

  const transition = useMemo(
    () =>
      reduce
        ? { duration: 0 }
        : { duration: 0.45, ease: [0.4, 0, 0.2, 1] as any },
    [reduce]
  );

  const goPrev = () => setIndex((v) => Math.max(0, v - 1));
  const goNext = () => setIndex((v) => Math.min(maxIndex, v + 1));

  if (items.length === 0) {
    return <div className="text-sm text-neutral-50/60">No photos yet.</div>;
  }

  return (
    <div className="relative">
      {/* bleed into BOTH left + right buffers */}
      <div className="relative -mx-6 sm:-mx-10">
        <div className="overflow-hidden px-6 sm:px-10">
          <motion.div
            className="flex gap-4"
            animate={{ x: -index * (CARD_WIDTH + CARD_GAP) }}
            transition={transition}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60 && canNext) goNext();
              else if (info.offset.x > 60 && canPrev) goPrev();
            }}
          >
            {items.map((item, i) => {
              const Card = (
                <article className="w-[256px] overflow-hidden rounded-2xl bg-white shadow-[0_0_20px_rgba(0,0,0,0.14)]">
                  {/* taller photos: 16/9 -> 16/13.5 (+50% height) */}
                  <div className="relative w-full aspect-[16/13.5]">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.location}
                        fill
                        className="object-cover"
                        sizes="256px"
                        priority={i < 2}
                      />
                    ) : (
                      <div className="h-full w-full bg-neutral-200" />
                    )}

                    <div className="absolute bottom-3 right-3">
                      <div className="rounded-full border border-black/10 bg-white/90 px-3 py-1 text-[11px] font-medium text-black backdrop-blur-sm">
                        {item.location}
                      </div>
                    </div>
                  </div>
                </article>
              );

              if (!item.href) {
                return (
                  <div
                    key={`${item.location}-${i}`}
                    className="block flex-shrink-0"
                  >
                    {Card}
                  </div>
                );
              }

              return (
                <Link
                  key={`${item.href}-${i}`}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block flex-shrink-0 focus-visible:outline-none"
                >
                  {Card}
                </Link>
              );
            })}
          </motion.div>
        </div>

        {/* arrows on bezels (close to edge, not touching) */}
        {canPrev && (
          <button
            type="button"
            aria-label="previous"
            onClick={goPrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-transparent p-2 text-white/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <Chevron direction="left" />
          </button>
        )}

        {canNext && (
          <button
            type="button"
            aria-label="next"
            onClick={goNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-transparent p-2 text-white/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <Chevron direction="right" />
          </button>
        )}
      </div>
    </div>
  );
}
