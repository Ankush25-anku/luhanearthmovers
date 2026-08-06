"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // Mobile browsers fire `resize` when the address bar collapses/expands
  // mid-scroll — without this, ScrollTrigger re-measures every trigger's
  // position on that resize, which is the single most common cause of
  // scroll-jank on mobile/tablet with GSAP.
  ScrollTrigger.config({ ignoreMobileResize: true });
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
    // Desktop keeps its exact original feel (untouched below). Below
    // 1024px, only `duration` is shortened — less lingering momentum after
    // the finger lifts — which still applies to any wheel/programmatic
    // scroll a hybrid touch+wheel device (e.g. a tablet with a trackpad)
    // might trigger.
    const isMobileOrTablet = window.innerWidth < 1024;

    const lenis = new Lenis({
      duration: isMobileOrTablet ? 1.0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      // `syncTouch` replays every touchmove through JS on the main thread so
      // touch tracks the exact same easing curve as wheel scroll. That's
      // cheap on a desktop's GPU/CPU — which is why Chrome DevTools' mobile
      // *simulation* (still running on desktop hardware) looks perfectly
      // smooth — but on a real phone it fights canvas draws and
      // ScrollTrigger updates for main-thread time every single frame,
      // which is the actual root cause of "smooth in DevTools, hangs on a
      // real device." With it off, touch scroll runs natively on the
      // compositor thread (GPU-driven, effectively free) on every touch
      // device, and Lenis just listens to the resulting native scroll
      // position — still fully active, still keeping ScrollTrigger in
      // sync — it only stops re-animating what the OS already animates
      // better. Desktop wheel/trackpad input is entirely unaffected.
      syncTouch: false,
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
