"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// Each layer's parallax intensity — smaller values drift less, larger
// values drift more, for a subtle sense of depth between them.
const LAYER_SPEEDS = {
  canvas: 0.02,
  overlay: 0.05,
  particles: 0.08,
  blueprintGrid: 0.12,
};

// Portion of the raw cursor delta applied per frame — lower is smoother/laggier.
const LERP_FACTOR = 0.08;

// Below this per-frame movement, treat the values as settled and skip the
// state update entirely (the rAF loop itself keeps ticking, cheaply, so it
// stays instantly responsive to the next mouse move).
const SETTLE_EPSILON = 0.01;

const ZERO_LAYERS = Object.keys(LAYER_SPEEDS).reduce((layers, name) => {
  layers[name] = { x: 0, y: 0, transform: "translate3d(0px, 0px, 0)" };
  return layers;
}, {});

const DESKTOP_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

// Synced via useSyncExternalStore below — the correct way to read external
// browser state (matchMedia) into React without a setState-in-effect.
function subscribeToPointerCapability(onChange) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mediaQueryList = window.matchMedia(DESKTOP_POINTER_QUERY);
  mediaQueryList.addEventListener("change", onChange);
  return () => mediaQueryList.removeEventListener("change", onChange);
}

function getPointerCapabilitySnapshot() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(DESKTOP_POINTER_QUERY).matches;
}

function getServerPointerCapabilitySnapshot() {
  return false;
}

/**
 * useMouseParallax
 * Tracks the cursor's pixel offset from the viewport center, smooths it
 * with a per-frame lerp (requestAnimationFrame — no GSAP, no Framer
 * Motion), and derives a distinct translate offset per Hero layer from
 * that single smoothed value via LAYER_SPEEDS. Desktop-with-mouse only —
 * on touch devices this is a no-op returning `enabled: false` and
 * all-zero offsets, and no listener is ever attached.
 *
 * @returns {{
 *   enabled: boolean,
 *   canvas: {x: number, y: number, transform: string},
 *   overlay: {x: number, y: number, transform: string},
 *   particles: {x: number, y: number, transform: string},
 *   blueprintGrid: {x: number, y: number, transform: string},
 * }}
 */
export default function useMouseParallax() {
  const enabled = useSyncExternalStore(
    subscribeToPointerCapability,
    getPointerCapabilitySnapshot,
    getServerPointerCapabilitySnapshot
  );
  const [layers, setLayers] = useState(ZERO_LAYERS);

  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    const handleMouseMove = (event) => {
      targetRef.current = {
        x: event.clientX - window.innerWidth / 2,
        y: event.clientY - window.innerHeight / 2,
      };
    };

    const tick = () => {
      const current = currentRef.current;
      const target = targetRef.current;
      const previousX = current.x;
      const previousY = current.y;

      current.x += (target.x - current.x) * LERP_FACTOR;
      current.y += (target.y - current.y) * LERP_FACTOR;

      const settled =
        Math.abs(current.x - previousX) < SETTLE_EPSILON &&
        Math.abs(current.y - previousY) < SETTLE_EPSILON;

      if (!settled) {
        const next = {};
        for (const [name, speed] of Object.entries(LAYER_SPEEDS)) {
          const x = current.x * speed;
          const y = current.y * speed;
          next[name] = { x, y, transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)` };
        }
        setLayers(next);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  return { enabled, ...layers };
}
