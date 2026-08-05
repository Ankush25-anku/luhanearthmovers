"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 180;

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
  return `/assets/hero/frames/frame_${String(frameNumber).padStart(4, "0")}.png`;
}

/**
 * `object-fit: cover` layout for `image` against the current viewport.
 * All 180 frames share the same source dimensions, so this only needs to
 * be recomputed on resize, never per-frame.
 */
function computeCoverLayout(image) {
  const dpr = window.devicePixelRatio || 1;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const imageRatio = image.naturalWidth / image.naturalHeight;
  const viewportRatio = viewportWidth / viewportHeight;

  let drawWidth;
  let drawHeight;
  if (imageRatio > viewportRatio) {
    drawHeight = viewportHeight;
    drawWidth = drawHeight * imageRatio;
  } else {
    drawWidth = viewportWidth;
    drawHeight = drawWidth / imageRatio;
  }

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
  const scrollTweenRef = useRef(null);

  /**
   * Draws the given 1-indexed frame using the cached cover-fit layout, at
   * full device pixel ratio for crisp Retina output. The backing store
   * (and everything derived from it) is only touched when it actually
   * changes — every other call is just one drawImage.
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

    // Preload all 180 frames into a ref (never React state, so loading
    // progress never triggers a re-render). Decode off the main thread
    // where supported, so the first paint of each frame doesn't stall on
    // synchronous decode work; frame 1 draws as soon as it's ready.
    for (let i = 0; i < TOTAL_FRAMES; i += 1) {
      const frameNumber = i + 1;
      const image = new window.Image();
      image.decoding = "async";
      image.src = getFramePath(frameNumber);

      const handleReady = () => {
        if (cancelled || frameNumber !== 1) return;
        renderFrame(1);
      };

      if (typeof image.decode === "function") {
        image
          .decode()
          .then(handleReady)
          .catch(() => {
            // decode() can reject (e.g. slow/aborted networks); the image
            // may still be usable, so fall back to the load event.
            if (!cancelled) image.onload = handleReady;
          });
      } else {
        image.onload = handleReady;
      }

      images[i] = image;
    }

    framesRef.current = images;

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

    // Sync GSAP/ScrollTrigger with Lenis if the app is running it —
    // Lenis virtualizes scroll, so ScrollTrigger needs an explicit nudge
    // to recalculate on Lenis's own scroll event rather than the native
    // one. This is a no-op if no Lenis instance is present.
    const lenis = typeof window !== "undefined" ? window.lenis : null;
    lenis?.on?.("scroll", ScrollTrigger.update);

    if (pinTarget) {
      const progressProxy = { value: 0 };

      scrollTweenRef.current = gsap.to(progressProxy, {
        value: 1,
        ease: "none",
        scrollTrigger: {
          trigger: pinTarget,
          start: "top top",
          end: "+=350%",
          pin: true,
          scrub: 0.35,
          anticipatePin: 1,
        },
        onUpdate: () => {
          const nextFrame = Math.round(mapProgressToFrame(progressProxy.value));
          if (nextFrame === targetFrameRef.current) return;
          targetFrameRef.current = nextFrame;
          scheduleRender();
        },
      });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleResize);
      if (resizeFrameRef.current) cancelAnimationFrame(resizeFrameRef.current);
      lenis?.off?.("scroll", ScrollTrigger.update);
      scrollTweenRef.current?.scrollTrigger?.kill();
      scrollTweenRef.current?.kill();
    };
  }, [renderFrame, scheduleRender]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 h-screen w-screen"
    />
  );
}
