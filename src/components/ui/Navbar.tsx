"use client";

import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-5 z-50 flex justify-center px-4 transition-transform duration-300">
      <div
        className={`flex items-center gap-2.5 sm:gap-4 rounded-full border px-4 sm:px-6 py-2 sm:py-2.5 transition-all duration-300 ${
          scrolled
            ? "border-blue-500/25 bg-[#020712]/55 shadow-[0_8px_32px_rgba(0,4,12,0.6),0_0_20px_rgba(59,130,246,0.15),inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-xl"
            : "border-white/10 bg-[#020712]/40 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_15px_rgba(59,130,246,0.08),inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-xl"
        }`}
      >
        <a
          href="#contact"
          className="hackx-btn-outline rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider"
        >
          CONTACT
        </a>
        <a
          href="#register"
          className="hackx-btn-primary rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider"
        >
          AMBASSADOR LOGIN
        </a>
      </div>
    </header>
  );
}
