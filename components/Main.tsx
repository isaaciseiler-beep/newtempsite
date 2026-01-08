// components/Main.tsx — DROP-IN REPLACEMENT
"use client";

import Brand from "./Brand";
import Menu from "./Menu";

export default function Main() {
  return (
    <main className="min-h-[100svh]">
      <Brand />
      <Menu />

      <div className="fixed bottom-4 left-6 z-50 select-none font-sans text-xs tracking-tight text-white/60">
        © 2025 Isaac Seiler
      </div>
    </main>
  );
}
