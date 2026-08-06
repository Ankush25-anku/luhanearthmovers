"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * SmoothScrollProvider
 * Initializes a single global Lenis instance, drives it from the GSAP
 * ticker (instead of its own rAF loop) so Lenis and every GSAP/ScrollTrigger
 * animation on the page share one clock, and keeps ScrollTrigger's cached
 * positions in sync with Lenis's virtual scroll. No CSS `scroll-behavior`
 * is used anywhere — this is the only smooth-scroll mechanism in the app.
 *
 * The instance is exposed on `window.lenis` so other components (e.g.
 * HeroCanvas) can opportunistically hook into it without a prop/context
 * dependency.
 */
export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      // Virtualize touch drags too (not just wheel) — without this, touch
      // scroll falls back to the browser's native momentum scroll, which
      // is exactly the "native scrolling feeling on mobile" we don't want.
      syncTouch: true,
      syncTouchLerp: 0.075,
    });

    window.lenis = lenis;

    // Keep ScrollTrigger's scroll position in sync with Lenis's own,
    // virtualized scroll updates.
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker rather than its own requestAnimationFrame
    // loop, so there is exactly one rAF driving both — no dueling loops,
    // no drift between Lenis and GSAP-timed animations.
    const syncWithGsapTicker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(syncWithGsapTicker);

    // GSAP's own lag-smoothing fights Lenis's smoothing after a stutter
    // (e.g. a tab coming back into focus) — Lenis already handles that.
    gsap.ticker.lagSmoothing(0);

    // Once fonts (and, after initial load, images) have settled, layout
    // may have shifted since ScrollTrigger last measured — refresh once so
    // every section's trigger positions stay accurate.
    const refreshScrollTrigger = () => ScrollTrigger.refresh();
    document.fonts?.ready?.then(refreshScrollTrigger);
    window.addEventListener("load", refreshScrollTrigger);

    return () => {
      window.removeEventListener("load", refreshScrollTrigger);
      gsap.ticker.remove(syncWithGsapTicker);
      lenis.destroy();
      if (window.lenis === lenis) delete window.lenis;
    };
  }, []);

  return children;
}
