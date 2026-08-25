import React, { useState, useEffect, useRef } from "react";
import logo from "../layout/logo.webp";

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(1);
  const [isFading, setIsFading] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    // 2.2 seconds for graceful, natural loading pace
    const duration = 2200;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);

      // Smooth custom easeOut curve
      const eased = 1 - Math.pow(1 - progressRatio, 2.8);
      const currentPercent = Math.max(1, Math.min(100, Math.floor(1 + 99 * eased)));

      setProgress(currentPercent);

      if (progressRatio < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setProgress(100);
        // Begin smooth fade-out reveal after hitting 100%
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 700); // Wait for 700ms smooth curtain dissolve
        }, 150);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#030712] text-white select-none overflow-hidden transition-all duration-700 ease-out will-change-transform ${
        isFading ? "opacity-0 pointer-events-none scale-105" : "opacity-100 scale-100"
      }`}
      role="status"
      aria-live="polite"
    >
      {/* ===================================================
          AUTOMATIC AMBIENT BACKGROUND ANIMATION (AURORA GLOW)
      ==================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Aurora Glow Orb 1 (Top Left) */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/20 blur-[120px] animate-pulse duration-3000" />

        {/* Animated Aurora Glow Orb 2 (Bottom Right) */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-[140px] animate-pulse duration-4000 delay-1000" />

        {/* Animated Central Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-[#2563EB]/10 blur-[100px] animate-pulse duration-2500" />

        {/* Subtle Tech Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-30" />

        {/* Radial Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#030712]/50 to-[#030712]" />
      </div>

      {/* ===================================================
          CENTER FOREGROUND CONTENT (LOGO + % + LINE)
      ==================================================== */}
      <div
        className={`relative z-10 w-full max-w-[300px] sm:max-w-[380px] px-6 flex flex-col items-center transition-all duration-500 ${
          isFading ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        {/* SC ACADEMY LOGO WITH WHITE CIRCULAR BACKGROUND */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white flex items-center justify-center p-4 sm:p-5 shadow-[0_12px_40px_rgba(0,0,0,0.55)] transition-transform duration-300">
            <img
              src={logo}
              alt="SC Academy"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="mt-3.5 text-xs sm:text-[13px] tracking-[0.25em] uppercase font-bold text-slate-300">
            SC ACADEMY
          </span>
        </div>

        {/* PERCENTAGE NUMBER IN SERIF STYLE */}
        <div className="font-serif font-bold text-3xl sm:text-4xl text-white tracking-wider mb-4 tabular-nums">
          {progress}%
        </div>

        {/* MINIMALIST HORIZONTAL PROGRESS LINE */}
        <div className="w-full h-[2.5px] bg-slate-800 relative overflow-hidden rounded-full backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-[#2563EB] to-blue-400 transition-all duration-100 ease-out rounded-full shadow-[0_0_12px_rgba(37,99,235,0.9)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;
