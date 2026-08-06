"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 180;
const FRAME_BATCH_SIZE_DESKTOP = 15; // unchanged: frames 2–180 in 12 small batches
const FRAME_BATCH_SIZE_MOBILE = 8; // smaller batches — lighter decode/memory burst per idle tick

/** Below 1024px only — desktop keeps its original batch size exactly. */
function getFrameBatchSize() {
  return window.innerWidth < 1024 ? FRAME_BATCH_SIZE_MOBILE : FRAME_BATCH_SIZE_DESKTOP;
}

/** Backing-store DPR cap — tighter on small phones, where fill-rate is scarcest. */
function getMaxDpr() {
  return window.innerWidth < 768 ? 1.5 : 2;
}

/**
 * Cinematic chapters — each maps a slice of linear scroll progress onto a
 * frame range, with its own easing, so scroll speed is not uniform across
 * the sequence:
 *  - Ch.1 (frames 1–35): eases in from a near-standstill — "almost frozen".
 *  - Ch.2 (frames 36–125): linear — the fast, high-motion middle.
 *  - Ch.3 (frames 126–180): eases out to a stop — the final frame "rests".
 * Progress shares (35% / 30% / 35%) are deliberately NOT proportional to
 * frame counts (19% / 50% / 31%): chapter 2 covers the most frames in the
 * smallest progress share (fast), while 1 and 3 cover fewer frames in a
 * larger share each (slow).
 */
const CHAPTERS = [
  {
    startFrame: 1,
    endFrame: 35,
    startProgress: 0,
    endProgress: 0.35,
    ease: gsap.parseEase("power2.in"),
  },
  {
    startFrame: 35,
    endFrame: 125,
    startProgress: 0.35,
    endProgress: 0.65,
    ease: gsap.parseEase("none"),
  },
  {
    startFrame: 125,
    endFrame: 180,
    startProgress: 0.65,
    endProgress: 1,
    ease: gsap.parseEase("power2.out"),
  },
];

/** Remaps linear scroll progress (0–1) onto a non-uniform frame number. */
function mapProgressToFrame(progress) {
  const clamped = Math.min(1, Math.max(0, progress));
  const chapter = CHAPTERS.find((c) => clamped <= c.endProgress) ?? CHAPTERS[CHAPTERS.length - 1];

  const span = chapter.endProgress - chapter.startProgress;
  const localT = span > 0 ? (clamped - chapter.startProgress) / span : 1;
  const easedT = chapter.ease(localT);

  return chapter.startFrame + easedT * (chapter.endFrame - chapter.startFrame);
}

function getFramePath(frameNumber) {
  return `/assets/hero/frames/frame_${String(frameNumber).padStart(4, "0")}.webp`;
}

/** Runs `callback` during idle time where supported, else a short timeout. */
function scheduleIdleWork(callback) {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(callback, { timeout: 500 });
  } else {
    setTimeout(callback, 32);
  }
}

/**
 * Image layout for `image` against the current viewport. All 180 frames
 * share the same source dimensions, so this only needs to be recomputed
 * on resize, never per-frame. DPR is capped (tighter on mobile) —
 * backing-store pixels beyond that are wasted cost, worst on exactly the
 * devices least able to afford it.
 *
 * Desktop/tablet (≥768px): `object-fit: cover` — scale by
 * `Math.max(widthRatio, heightRatio)` so the viewport is fully filled,
 * center-cropping whichever axis overflows. Unchanged from before.
 *
 * Mobile (<768px): `object-fit: contain`-style cinematic scaling — scale
 * by `Math.min(widthRatio, heightRatio)` instead, so the full composition
 * (the whole excavator scene) always fits inside the viewport with
 * nothing cropped, letterboxing the other axis instead of cutting into
 * the subject. Same centering math either way.
 */
function computeCoverLayout(image) {
  const dpr = Math.min(window.devicePixelRatio || 1, getMaxDpr());
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const isMobile = viewportWidth < 768;

  const widthRatio = viewportWidth / image.naturalWidth;
  const heightRatio = viewportHeight / image.naturalHeight;
  const scale = isMobile ? Math.min(widthRatio, heightRatio) : Math.max(widthRatio, heightRatio);

  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;

  return {
    dpr,
    backingWidth: Math.round(viewportWidth * dpr),
    backingHeight: Math.round(viewportHeight * dpr),
    drawWidth,
    drawHeight,
    offsetX: (viewportWidth - drawWidth) / 2,
    offsetY: (viewportHeight - drawHeight) / 2,
  };
}

export default function HeroCanvas() {
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const resizeFrameRef = useRef(null);
  const layoutRef = useRef(null); // cached computeCoverLayout() result

  // Frame-scrub bookkeeping — refs only, no React state.
  const currentFrameRef = useRef(1); // last frame actually drawn
  const targetFrameRef = useRef(1); // latest frame requested by scroll
  const renderScheduledRef = useRef(false);

  /**
   * Draws the given 1-indexed frame using the cached cover-fit layout, at
   * full (capped) device pixel ratio for crisp Retina output. The backing
   * store (and everything derived from it) is only touched when it
   * actually changes — every other call is just one drawImage.
   */
  const renderFrame = useCallback((frameNumber) => {
    const canvas = canvasRef.current;
    const image = framesRef.current[frameNumber - 1];
    if (!canvas || !image || !image.complete || !image.naturalWidth) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let layout = layoutRef.current;
    if (!layout) {
      layout = computeCoverLayout(image);
      layoutRef.current = layout;
    }

    if (canvas.width !== layout.backingWidth || canvas.height !== layout.backingHeight) {
      canvas.width = layout.backingWidth;
      canvas.height = layout.backingHeight;
      // Resizing the backing store resets all context state, so the
      // transform and smoothing settings only need reapplying right here.
      ctx.setTransform(layout.dpr, 0, 0, layout.dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    }

    // No clearRect: `cover` fit always fully overwrites every pixel, so
    // clearing first is pure wasted fill work every frame.
    ctx.drawImage(image, layout.offsetX, layout.offsetY, layout.drawWidth, layout.drawHeight);
  }, []);

  /** Coalesces scroll-driven frame requests into one draw per animation frame. */
  const scheduleRender = useCallback(() => {
    if (renderScheduledRef.current) return;
    renderScheduledRef.current = true;

    requestAnimationFrame(() => {
      renderScheduledRef.current = false;
      if (targetFrameRef.current === currentFrameRef.current) return;
      currentFrameRef.current = targetFrameRef.current;
      renderFrame(currentFrameRef.current);
    });
  }, [renderFrame]);

  useEffect(() => {
    let cancelled = false;
    const images = new Array(TOTAL_FRAMES);
    framesRef.current = images;

    // Priority load: frame 1 is fetched + decoded immediately since first
    // paint depends on it. Frames 2–180 are NOT requested up front — they
    // load in small batches, deferred to browser idle time, so the initial
    // burst of 180 concurrent requests/decodes (the old behavior) can't
    // stall the main thread or the network right when the page needs to
    // become interactive.
    const firstImage = new window.Image();
    firstImage.decoding = "async";
    firstImage.src = getFramePath(1);
    images[0] = firstImage;

    const handleFirstFrameReady = () => {
      if (!cancelled) renderFrame(1);
    };

    if (typeof firstImage.decode === "function") {
      firstImage
        .decode()
        .then(handleFirstFrameReady)
        .catch(() => {
          if (!cancelled) firstImage.onload = handleFirstFrameReady;
        });
    } else {
      firstImage.onload = handleFirstFrameReady;
    }

    const loadRemainingFrames = (startIndex) => {
      if (cancelled) return;
      const endIndex = Math.min(startIndex + getFrameBatchSize(), TOTAL_FRAMES);

      for (let i = startIndex; i < endIndex; i += 1) {
        const frameNumber = i + 1;
        const image = new window.Image();
        image.decoding = "async";
        image.src = getFramePath(frameNumber);
        if (typeof image.decode === "function") {
          image.decode().catch(() => {}); // pre-decode; failures are harmless here
        }
        images[i] = image;
      }

      if (endIndex < TOTAL_FRAMES) {
        scheduleIdleWork(() => loadRemainingFrames(endIndex));
      }
    };

    scheduleIdleWork(() => loadRemainingFrames(1)); // index 1 === frame 2

    const handleResize = () => {
      if (resizeFrameRef.current) cancelAnimationFrame(resizeFrameRef.current);
      resizeFrameRef.current = requestAnimationFrame(() => {
        layoutRef.current = null; // force a fresh cover-fit layout
        renderFrame(currentFrameRef.current);
      });
    };

    window.addEventListener("resize", handleResize);

    // Pin the Hero section (the canvas's nearest <section> ancestor — this
    // component never touches Hero.jsx itself) and scrub a plain linear
    // 0→1 progress value against scroll position. A light numeric scrub
    // (rather than `true`/immediate) smooths out the irregular deltas
    // wheel/trackpad input produces, which is gentler on the main thread
    // than reacting to every raw tick — while staying visually identical.
    // That raw progress is then remapped through the three cinematic
    // chapters (see `mapProgressToFrame`) to get the actual, non-uniformly
    // paced frame number; the timeline itself is untouched.
    const pinTarget = canvasRef.current?.closest("section") ?? canvasRef.current?.parentElement;

    // Sync with Lenis if SmoothScrollProvider has set it up — Lenis
    // virtualizes scroll, so ScrollTrigger needs an explicit nudge to
    // recalculate on Lenis's own scroll event rather than the native one.
    // No-op if no Lenis instance is present.
    const lenis = typeof window !== "undefined" ? window.lenis : null;
    lenis?.on?.("scroll", ScrollTrigger.update);

    // Same cinematic chapters/easing everywhere — only the total pin
    // distance (how much scroll the whole sequence asks for) scales down
    // on smaller viewports, so mobile isn't committed to as long a scrub.
    const mm = gsap.matchMedia();

    if (pinTarget) {
      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isTablet: "(min-width: 768px) and (max-width: 1023px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop, isTablet } = context.conditions;
          // Same pin distance everywhere, just scaled — 100% desktop /
          // 90% tablet / 80% mobile — so mobile still gets the full
          // three-chapter cinematic scrub, not a shortened placeholder.
          const pinDistance = isDesktop ? "350%" : isTablet ? "315%" : "280%";
          // Lenis already smooths touch/wheel input; stacking GSAP's own
          // scrub lag on top of that on a touch device reads as sluggish,
          // so mobile/tablet scrub closer to 1:1 while desktop keeps the
          // original, slightly-smoothed feel exactly as it was.
          const scrubAmount = isDesktop ? 0.35 : isTablet ? 0.25 : 0.15;

          const progressProxy = { value: 0 };

          const tween = gsap.to(progressProxy, {
            value: 1,
            ease: "none",
            scrollTrigger: {
              trigger: pinTarget,
              start: "top top",
              end: `+=${pinDistance}`,
              pin: true,
              scrub: scrubAmount,
              anticipatePin: 1,
            },
            onUpdate: () => {
              const nextFrame = Math.round(mapProgressToFrame(progressProxy.value));
              if (nextFrame === targetFrameRef.current) return;
              targetFrameRef.current = nextFrame;
              scheduleRender();
            },
          });

          return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
          };
        }
      );
    }

    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleResize);
      if (resizeFrameRef.current) cancelAnimationFrame(resizeFrameRef.current);
      lenis?.off?.("scroll", ScrollTrigger.update);
      mm.revert();
    };
  }, [renderFrame, scheduleRender]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
