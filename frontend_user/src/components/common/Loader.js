import React, { useState, useEffect, useRef } from "react";
import { useSettings } from "../../context/SettingsContext";

const Loader = ({ onComplete }) => {
  const { logo: siteLogo } = useSettings();
  const [progress, setProgress] = useState(1);
  const [isFading, setIsFading] = useState(false);
  const animationRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // 2.0 seconds for smooth, immersive natural pacing
    const duration = 2000;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);

      // Smooth cubic easeOut curve
      const eased = 1 - Math.pow(1 - progressRatio, 3.2);
      const currentPercent = Math.max(1, Math.min(100, Math.floor(1 + 99 * eased)));

      setProgress(currentPercent);

      if (progressRatio < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setProgress(100);
        // Begin smooth curtain dissolve after hitting 100%
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            if (onCompleteRef.current) onCompleteRef.current();
          }, 600); // 600ms ultra-smooth curtain dissolve
        }, 150);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    // Safety fallback timeout
    const safetyTimer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        if (onCompleteRef.current) onCompleteRef.current();
      }, 600);
    }, 2800);

    return () => {
      clearTimeout(safetyTimer);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Dynamic HUD Status Message based on progress
  const getStatusText = () => {
    if (progress < 30) return "INITIALIZING DIGITAL ACADEMY...";
    if (progress < 70) return "LOADING COURSES & INTERACTIVE LABS...";
    if (progress < 98) return "PREPARING FUTURE LEADERS 2026...";
    return "WELCOME TO SC ACADEMY";
  };

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050B1A] text-white select-none overflow-hidden transition-all duration-700 ease-out will-change-transform ${
        isFading ? "opacity-0 pointer-events-none scale-105" : "opacity-100 scale-100"
      }`}
      role="status"
      aria-live="polite"
    >
      {/* ===================================================
          1. ANIMATED MULTI-LAYER PATTERN BACKGROUND
      ==================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Layer A: Dynamic Animated Dot Matrix Grid */}
        <div
          className="absolute inset-0 opacity-40 animate-[pulse_6s_ease-in-out_infinite]"
          style={{
            backgroundImage: "radial-gradient(rgba(56, 189, 248, 0.45) 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Layer B: Cyber Tech Grid Lines */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(37, 99, 235, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(37, 99, 235, 0.25) 1px, transparent 1px)",
            backgroundSize: "4rem 4rem",
          }}
        />

        {/* Layer C: Horizontal Laser Scanline Ray */}
        <div className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-sky-400/10 to-transparent opacity-60 -translate-y-full animate-[scanline_4s_linear_infinite]" />

        {/* Layer D: Ambient Glowing Radial Auroras */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/25 blur-[120px] pointer-events-none animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-600/20 blur-[130px] pointer-events-none animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-sky-500/15 blur-[140px] pointer-events-none animate-pulse"
          style={{ animationDelay: "3s" }}
        />

        {/* Layer E: Radial Vignette Mask */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#050B1A_85%)]" />

        {/* Layer F: Floating Geometric Particles */}
        <div className="absolute top-[12%] left-[15%] w-2.5 h-2.5 rounded-full bg-sky-400/50 blur-[0.5px] animate-float-slow" />
        <div className="absolute top-[25%] right-[18%] w-3 h-3 rounded-full bg-blue-400/40 blur-[0.5px] animate-float-delayed" />
        <div className="absolute bottom-[20%] left-[22%] w-2 h-2 rounded-full bg-indigo-400/50 blur-[0.5px] animate-float-reverse" />
        <div className="absolute bottom-[28%] right-[15%] w-3 h-3 rounded-full bg-cyan-400/40 blur-[0.5px] animate-float-slow" />
      </div>

      {/* ===================================================
          2. CENTER FOREGROUND: HOLOGRAPHIC ORBITAL HUB
      ==================================================== */}
      <div
        className={`relative z-10 w-full max-w-[340px] sm:max-w-[420px] px-6 flex flex-col items-center transition-all duration-500 ${
          isFading ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {/* HOLOGRAPHIC ORBITAL RING CONTAINER */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Outer Rotating Dashed Tech Compass Ring */}
          <div
            className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-dashed border-sky-400/30 animate-spin"
            style={{ animationDuration: "16s" }}
          />

          {/* Middle Counter-Spinning Dual-Tone Glowing Ring */}
          <div
            className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full border-[2px] border-transparent border-t-blue-500 border-r-cyan-400 border-b-transparent border-l-indigo-400/40 animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "3.5s" }}
          />

          {/* Inner Glowing Aura */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/40 to-sky-400/30 blur-xl animate-pulse" />

          {/* SC ACADEMY LOGO BADGE */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white flex items-center justify-center p-3.5 sm:p-4 shadow-[0_12px_45px_rgba(0,0,0,0.65)] ring-4 ring-white/10 transition-transform duration-300">
            <img
              src={siteLogo || "/logo.png"}
              alt="SC Academy"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>
        </div>

        {/* BRAND BADGE / TITLE */}
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
          <span className="text-xs sm:text-sm tracking-[0.28em] uppercase font-extrabold text-slate-200">
            SC ACADEMY
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />
        </div>

        {/* PERCENTAGE COUNTER WITH GLOW */}
        <div className="font-mono font-extrabold text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-blue-300 tracking-tight my-2 tabular-nums drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]">
          {progress.toString().padStart(2, "0")}
          <span className="text-2xl sm:text-3xl text-sky-400 font-bold ml-1">%</span>
        </div>

        {/* DYNAMIC HUD STATUS SUBTEXT */}
        <p className="text-[11px] sm:text-xs font-mono font-semibold tracking-wider text-sky-300/80 uppercase mb-4 h-4 text-center">
          {getStatusText()}
        </p>

        {/* HIGH-PRECISION GLOWING PROGRESS BAR */}
        <div className="w-full h-2 bg-slate-900/90 relative overflow-hidden rounded-full border border-white/10 backdrop-blur-md p-0.5 shadow-inner">
          {/* Animated Gradient Active Fill */}
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 transition-all duration-100 ease-out rounded-full shadow-[0_0_16px_rgba(56,189,248,0.9)] relative"
            style={{ width: `${progress}%` }}
          >
            {/* Pulsing Light Head Node at the Leading Edge */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
          </div>
        </div>

        {/* PROGRESS MILESTONES (00 / 50 / 100) */}
        <div className="w-full flex justify-between text-[10px] font-mono text-slate-500 mt-2 px-0.5">
          <span>00</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      {/* Global Embedded Scanline Keyframes */}
      <style>{`
        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(1000%);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;

