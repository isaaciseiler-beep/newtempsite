"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

export type PhotoItem = {
  location: string;
};

const CARD_WIDTH = 320;
const CARD_GAP = 16;

export default function PhotoCarousel({ items }: { items: PhotoItem[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  const maxIndex = Math.max(0, items.length - 1);
  const canPrev = index > 0;
  const canNext = index < maxIndex;

  const transition = useMemo(
    () => (reduce ? { duration: 0 } : { duration: 0.45, ease: [0.4, 0, 0.2, 1] }),
    [reduce]
  );

  return (
    <div className="relative">
      <div className="relative -mx-4 sm:-mx-6">
        <div className="overflow-hidden px-4 sm:px-6">
          <motion.div
            className="flex gap-4"
            animate={{ x: -index * (CARD_WIDTH + CARD_GAP) }}
            transition={transition}
          >
            {items.map((item, i) => (
              <div
                key={i}
                className="w-[320px] overflow-hidden rounded-2xl bg-white shadow-lg"
              >
                <div className="aspect-video bg-neutral-200" />
                <div className="p-3 text-xs font-medium text-black">
                  {item.location}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {canPrev && (
          <button
            onClick={() => setIndex(index - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 backdrop-blur transition hover:bg-white"
          >
            ←
          </button>
        )}

        {canNext && (
          <button
            onClick={() => setIndex(index + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-3 backdrop-blur transition hover:bg-white"
          >
            →
          </button>
        )}
      </div>
    </div>
  );
}
