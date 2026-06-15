"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DIALOGUES, Dialogue, FRAME_COUNT, framePath } from "@/lib/hero";

const TelemetryIndicator = ({ num, label }: { num: string; label: string }) => (
  <div className="flex flex-col items-center gap-3 font-mono select-none">
    <span className="text-[11px] font-semibold tracking-wider text-blue-500/80">{num}</span>
    <div className="w-6 h-[1px] bg-blue-500/35" />
    <span className="text-[8px] font-bold tracking-[0.25em] text-zinc-500 [writing-mode:vertical-lr] rotate-180">
      {label}
    </span>
    <div className="flex flex-col gap-1.5 mt-2">
      <div className="w-1 h-1 rounded-full bg-blue-500/80 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
      <div className="w-1 h-1 rounded-full bg-zinc-700" />
      <div className="w-1 h-1 rounded-full bg-zinc-700" />
      <div className="w-1 h-1 rounded-full bg-zinc-700" />
    </div>
  </div>
);



export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const framesRef = useRef<HTMLImageElement[]>([]);
  const tickingRef = useRef(false);
  const loadedRef = useRef(false);
  const lastFrameRef = useRef(-1);

  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [activeDialogue, setActiveDialogue] = useState<Dialogue | null>(DIALOGUES[0]);

  useEffect(() => {
    if (!loaded) return;
    const canvas = particlesCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    interface Particle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
    }

    const particles: Particle[] = [];
    const colors = [
      "rgba(59, 130, 246, ", // blue
      "rgba(34, 211, 238, ", // cyan
      "rgba(224, 170, 62, "  // gold
    ];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.4 - 0.15,
        alpha: Math.random() * 0.45 + 0.15,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.vy;
        p.x += p.vx;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0 || p.x > width) {
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ")";
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [loaded]);

  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        if (cancelled) return;
        loadedCount++;
        setLoadProgress(loadedCount / FRAME_COUNT);
        if (loadedCount === FRAME_COUNT) {
          loadedRef.current = true;
          setLoaded(true);
        }
      };
      img.onerror = () => {
        if (cancelled) return;
        loadedCount++;
        setLoadProgress(loadedCount / FRAME_COUNT);
        if (loadedCount === FRAME_COUNT) {
          loadedRef.current = true;
          setLoaded(true);
        }
      };
      imgs.push(img);
    }
    framesRef.current = imgs;

    return () => {
      cancelled = true;
    };
  }, []);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img || !img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const cw = canvas.width;
    const ch = canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;

    let drawW: number;
    let drawH: number;
    if (canvasRatio > imgRatio) {
      drawW = cw;
      drawH = cw / imgRatio;
    } else {
      drawH = ch;
      drawW = ch * imgRatio;
    }

    if (window.innerWidth <= 768) {
      drawW *= 1.3;
      drawH *= 1.3;
    }

    const drawX = (cw - drawW) / 2;
    const drawY = (ch - drawH) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(1, 1);
    drawFrame(lastFrameRef.current >= 0 ? lastFrameRef.current : 0);
  }, [drawFrame]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    if (!loaded) return;
    drawFrame(0);
    lastFrameRef.current = 0;
  }, [loaded, drawFrame]);

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        tickingRef.current = false;
        const section = sectionRef.current;
        if (!section || !loadedRef.current) return;

        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        const progress =
          scrollable <= 0
            ? 0
            : Math.min(1, Math.max(0, -rect.top / scrollable));

        const frameIndex = Math.min(
          FRAME_COUNT - 1,
          Math.floor(progress * FRAME_COUNT),
        );
        if (frameIndex !== lastFrameRef.current) {
          lastFrameRef.current = frameIndex;
          drawFrame(frameIndex);
        }

        let active: Dialogue | null = null;
        if (progress < 0.35) {
          active = DIALOGUES[0]; // d1
        } else if (progress >= 0.35 && progress < 0.6) {
          active = DIALOGUES[1]; // d2
        } else {
          active = DIALOGUES[2]; // d3
        }
        setActiveDialogue(active);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [drawFrame, loaded]);

  return (
    <section ref={sectionRef} className="scroll-animation relative">
      <div
        className="sticky top-0 min-h-[100dvh] w-full overflow-hidden bg-background"
        style={{ height: "100dvh", willChange: "transform", transform: "translateZ(0)" }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ willChange: "contents", transform: "translateZ(0)" }}
        />

        {!loaded && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-[#020712] px-6">
            <div className="flex flex-col items-center gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[var(--accent-gold)] animate-pulse">
                [ System Startup ]
              </span>
              <h3 className="font-sans text-xl font-bold tracking-tight text-white uppercase">
                HackX Ambassador
              </h3>
            </div>

            <div className="h-1.5 w-60 rounded-full bg-blue-950/40 overflow-hidden border border-blue-900/30 md:w-80 shadow-[0_0_12px_rgba(59,130,246,0.15)]">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-[width] duration-150 ease-out shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                style={{ width: `${Math.round(loadProgress * 100)}%` }}
              />
            </div>

            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-500">
              Initializing Core Telemetry &nbsp;&middot;&nbsp; {Math.round(loadProgress * 100)}%
            </p>
          </div>
        )}

        {loaded && (
          <canvas
            ref={particlesCanvasRef}
            className="absolute inset-0 h-full w-full pointer-events-none z-10"
            style={{ mixBlendMode: "screen" }}
          />
        )}

        {loaded && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6">
            {DIALOGUES.map((d) => {
              const visible = activeDialogue?.id === d.id;

              if (d.id === "d1") {
                return (
                  <div
                    key={d.id}
                    className={`absolute left-6 right-6 md:left-auto md:right-16 lg:right-24 top-24 md:top-32 md:max-w-[550px] text-left transition-all duration-700 ease-in-out ${
                      visible
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-8 pointer-events-none"
                    }`}
                  >
                    {/* Ambient Blue Halo */}
                    <div className="absolute -inset-10 -z-10 bg-blue-600/[0.08] blur-[70px] rounded-full pointer-events-none" />
                    <div className="flex items-start gap-3 sm:gap-6 text-left">
                      <TelemetryIndicator num="01" label="EXPLORE" />
                      <div className="flex-1">
                        <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95] text-white select-none">
                          DIVE INTO
                          <br />
                          <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-blue-600 bg-clip-text text-transparent">
                            IMPACT.
                          </span>
                        </h1>
                        {/* Accent Line */}
                        <div className="w-14 h-[2px] bg-blue-500/80 my-5 rounded-full" />
                        <p className="font-sans text-zinc-300 text-xs md:text-sm leading-relaxed max-w-[420px]">
                          Join a nationwide network of changemakers. Represent HackX at your university and drive innovation, impact, and growth.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              if (d.id === "d2") {
                return null;
              }

              if (d.id === "d3") {
                return (
                  <div
                    key={d.id}
                    className={`absolute left-6 right-6 md:right-auto md:left-16 lg:left-24 top-1/2 -translate-y-1/2 md:max-w-[680px] text-left transition-all duration-700 ease-in-out ${
                      visible
                        ? "opacity-100 translate-x-0 pointer-events-auto"
                        : "opacity-0 -translate-x-12 pointer-events-none"
                    }`}
                  >
                    {/* Ambient Blue Halo */}
                    <div className="absolute -inset-16 -z-10 bg-blue-600/[0.08] blur-[80px] rounded-full pointer-events-none" />
                    <div className="flex items-start gap-3 sm:gap-6 text-left">
                      <TelemetryIndicator num="03" label="GROW" />
                      <div className="flex-1">
                        <h1 className="font-sans text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[0.95] text-white select-none">
                          BE THE VOICE. LEAD THE CHANGE.
                          <br />
                          <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-blue-600 bg-clip-text text-transparent">
                            LEAVE A LEGACY.
                          </span>
                        </h1>
                        {/* Accent Line */}
                        <div className="w-14 h-[2px] bg-blue-500/80 my-5 rounded-full" />
                        <p className="font-sans text-zinc-300 text-xs md:text-sm leading-relaxed max-w-[460px]">
                          As a HackX Ambassador, you don't just participate, you lead, inspire, and elevate the entire community.
                        </p>
                        {/* Action Buttons */}
                        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                          <a
                            href="#apply"
                            className="hackx-btn-primary flex items-center justify-between gap-3 sm:gap-6 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(59,130,246,0.35)]"
                          >
                            <span className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                              APPLY TO BE AN AMBASSADOR
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                          </a>
                          <a
                            href="#login"
                            className="hackx-btn-outline flex items-center justify-between gap-3 sm:gap-6 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border border-blue-500/25 bg-blue-950/10 hover:border-blue-500/50 transition-all duration-200"
                          >
                            <span className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                              AMBASSADOR LOGIN
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}
      </div>
    </section>
  );
}
