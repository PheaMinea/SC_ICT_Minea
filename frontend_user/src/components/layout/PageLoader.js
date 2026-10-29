// PageLoader.jsx - Clean & Lightweight Circular Spinner on Page Navigation
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

const PageLoader = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const timerRef = useRef(null);
  const fadeTimerRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip initial page load (Home has its own initial loader)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setLoading(true);
    setIsFading(false);

    // Fast, responsive loading duration (450ms)
    timerRef.current = setTimeout(() => {
      setIsFading(true);
      fadeTimerRef.current = setTimeout(() => {
        setLoading(false);
        setIsFading(false);
      }, 200);
    }, 450);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center bg-transparent transition-opacity duration-200 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      {/* Pure Floating Ring Spinner (100% Transparent, No Background) */}
      <div className="relative w-11 h-11 flex items-center justify-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
        {/* Background Track Ring */}
        <div className="w-11 h-11 rounded-full border-[3px] border-slate-300/60 dark:border-slate-600/60" />
        {/* Animated Royal Blue Spinner */}
        <div className="absolute inset-0 w-11 h-11 rounded-full border-[3px] border-transparent border-t-[#2563EB] border-r-[#2563EB] animate-spin" />
      </div>
    </div>
  );
};

export default PageLoader;



