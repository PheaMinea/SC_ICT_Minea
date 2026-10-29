import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

export default function SmoothScroll() {
  const location = useLocation();
  const observerRef = useRef(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-style smooth exponential deceleration
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    window.__lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // Global On-Scroll Animation Observer (observes .scroll-reveal, .scroll-reveal-text, cards, sections)
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    // Disconnect existing observer if any
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            entry.target.classList.add("animate-reveal");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px 50px 0px", // Pre-trigger slightly before entering viewport
      }
    );

    observerRef.current = observer;

    const checkAndObserve = () => {
      const targets = document.querySelectorAll(
        ".scroll-reveal, .scroll-reveal-text, .reveal-section, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-zoom, [data-reveal]"
      );

      const vHeight = window.innerHeight || document.documentElement.clientHeight;

      targets.forEach((el, index) => {
        if (el.classList.contains("is-revealed")) return;

        const rect = el.getBoundingClientRect();
        // If element is already inside viewport or close to it
        if (rect.top <= vHeight * 0.92) {
          setTimeout(() => {
            el.classList.add("is-revealed");
          }, Math.min(index * 40, 250));
        } else {
          observer.observe(el);
        }
      });
    };

    // Initial check
    checkAndObserve();

    // Check after intervals to catch API responses and Loader finish
    const t1 = setTimeout(checkAndObserve, 300);
    const t2 = setTimeout(checkAndObserve, 800);
    const t3 = setTimeout(checkAndObserve, 2500);

    // Watch for dynamic DOM additions (when API data or React components mount)
    const mutationObserver = new MutationObserver(() => {
      checkAndObserve();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Also trigger on scroll event
    window.addEventListener("scroll", checkAndObserve, { passive: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      mutationObserver.disconnect();
      window.removeEventListener("scroll", checkAndObserve);
      observer.disconnect();
    };
  }, [location.pathname]);

  // Scroll to top instantly when page route changes
  useEffect(() => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return null;
}

