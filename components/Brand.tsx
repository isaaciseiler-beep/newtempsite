"use client";

import { motion } from "framer-motion";

export default function Brand() {
  return (
    <div className="pointer-events-none fixed left-4 top-6 z-50 sm:left-6">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative"
      >
        <div className="absolute inset-[-18px] rounded-full bg-white/25 blur-2xl" />
        <div className="relative text-sm font-semibold tracking-wide text-white">
          Isaac Seiler
        </div>
      </motion.div>
    </div>
  );
}
