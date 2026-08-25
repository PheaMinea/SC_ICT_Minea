// PageLoader.jsx - Clean Circular Ring Spinner on Page Navigation (Transparent Background)
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

const PageLoader = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const timerRef = useRef(null);
  const fadeTimerRef = useRef(null);
  const firstRun = useRef(true);

  useEffect(() => {
    // Skip initial page load (Home has its own Loader)
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    setLoading(true);
    setIsFading(false);

    // Steady duration (~700ms) with gentle fade-out
    timerRef.current = setTimeout(() => {
      setIsFading(true);
      fadeTimerRef.current = setTimeout(() => {
        setLoading(false);
        setIsFading(false);
      }, 200);
    }, 700);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[99999] flex items-center justify-center bg-transparent transition-opacity duration-200 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      {/* Centered Circular Ring Spinner (រង្វង់មូល - 100% Transparent Background) */}
      <div className="relative w-12 h-12 flex items-center justify-center filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
        {/* Background Circle Track */}
        <div className="w-12 h-12 rounded-full border-[3.5px] border-white/40 dark:border-slate-700/60" />
        {/* Animated Royal Blue Spinning Ring */}
        <div className="absolute inset-0 w-12 h-12 rounded-full border-[3.5px] border-transparent border-t-[#2563EB] border-r-[#2563EB] animate-spin" />
      </div>
    </div>
  );
};

export default PageLoader;
