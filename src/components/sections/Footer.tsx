import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export function Footer() {
  return (
    <footer
      id="footer"
      className="relative border-t border-white/5 bg-[#020712] px-6 py-16 md:px-10 md:py-20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 relative z-10">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-start">
          {/* Logo & Description */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-1 font-sans text-xl font-bold tracking-tight text-white">
              <span>hack</span>
              <span className="relative font-serif font-extrabold text-[var(--accent-gold)]">
                X
                <span className="absolute -right-4 top-0.5 font-mono text-[7px] font-normal tracking-none text-zinc-500">
                  9.0
                </span>
              </span>
            </div>
            <p className="max-w-[40ch] font-sans text-sm leading-relaxed text-zinc-400">
              &copy; {new Date().getFullYear()} HackX &mdash; Department of Industrial Management, University of Kelaniya.
              Bridging the gap between brilliant academic concepts and commercial reality.
            </p>
          </div>

          {/* Archive Cards Grid */}
          <div className="flex flex-col gap-4">
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-500">
              Past Editions Archive
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                ["HackX 2020", "Innovate"],
                ["HackX 2021", "Disrupt"],
                ["HackX 2022", "Evolve"],
                ["HackX 2023", "Elevate"],
                ["HackX 2024", "Inspire"],
                ["HackX 2026", "Infinite"],
              ].map(([name, note]) => (
                <a
                  key={name}
                  href="#"
                  className="group hackx-glass flex flex-col gap-1 p-4 rounded-[16px] border border-white/5 transition-all duration-300 hover:border-blue-500/30 hover:bg-blue-500/[0.04] hover:-translate-y-[2px]"
                >
                  <span className="font-sans text-xs font-semibold text-white transition-colors group-hover:text-blue-400 flex items-center justify-between">
                    {name}
                    <ArrowUpRight
                      size={12}
                      weight="bold"
                      className="opacity-40 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-500">
                    {note}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="flex flex-col gap-3 border-t border-white/5 pt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Build 2026 &nbsp;&middot;&nbsp; Ambassador Program</span>
          <span>Proof of concept &mdash; Department of Industrial Management</span>
        </div>
      </div>
    </footer>
  );
}
