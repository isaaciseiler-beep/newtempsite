// components/ParallaxDivider.tsx
"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export default function ParallaxDivider({ amount = 18 }: { amount?: number }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1200], [0, reduce ? 0 : amount]);

  return (
    <motion.div aria-hidden style={{ y }} className="my-10 h-10 w-full">
      {/* spacer only (keeps parallax motion without visual dividers) */}
    </motion.div>
  );
}
