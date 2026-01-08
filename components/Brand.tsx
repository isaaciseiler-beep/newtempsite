"use client";

import { motion } from "framer-motion";

export default function Brand() {
  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-50">
      <div className="px-4 sm:px-6 pt-5">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative"
        >
          {/* background-matched blur “puddle” behind the logo row */}
          <div className="absolute inset-x-0 -top-3 h-[72px] rounded-[28px] bg-neutral-900/70 blur-xl" />
          <div className="absolute inset-x-0 -top-1 h-[64px] rounded-[26px] bg-neutral-900/55 backdrop-blur-md ring-1 ring-white/10" />

          <div className="relative flex items-center justify-between">
            <div className="text-2xl font-semibold tracking-tight text-neutral-50 sm:text-3xl md:text-4xl">
              Isaac
            </div>
            <div className="text-2xl font-semibold tracking-tight text-neutral-50 sm:text-3xl md:text-4xl">
              Seiler
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
