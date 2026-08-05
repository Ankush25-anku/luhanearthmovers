/**
 * GSAP Pinned Section
 * Reusable helper for pinning a section in the viewport for the duration of
 * a scroll distance — optionally driving a supplied GSAP animation/timeline
 * across that same pinned range.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * @param {string|Element} target - The element to pin.
 * @param {object} [options]
 * @param {string} [options.start="top top"]
 * @param {string} [options.end="+=100%"] - Scroll distance the pin lasts for.
 * @param {boolean} [options.pin=true]
 * @param {boolean} [options.pinSpacing=true]
 * @param {number} [options.anticipatePin=1]
 * @param {number|boolean} [options.scrub=false] - Set truthy when driving
 *   `options.animation` in sync with scroll position.
 * @param {gsap.core.Timeline|gsap.core.Tween} [options.animation] - An
 *   existing (paused) animation to scrub across the pinned duration.
 * @param {boolean} [options.markers=false]
 * @param {object} [options.rest] - Any additional ScrollTrigger vars.
 * @returns {ScrollTrigger|null}
 */
export function pinSection(target, options = {}) {
  const {
    start = "top top",
    end = "+=100%",
    pin = true,
    pinSpacing = true,
    anticipatePin = 1,
    scrub = false,
    animation,
    markers = false,
    ...rest
  } = options;

  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return null;

  return ScrollTrigger.create({
    trigger: el,
    start,
    end,
    pin,
    pinSpacing,
    anticipatePin,
    scrub,
    animation,
    markers,
    ...rest,
  });
}

/**
 * Convenience wrapper: pins `target` and builds a paused timeline scrubbed
 * across the pinned scroll range, handing the timeline to `configure` so
 * the caller can add tweens without managing the ScrollTrigger wiring.
 *
 * @param {string|Element} target
 * @param {(timeline: gsap.core.Timeline) => void} configure
 * @param {object} [options] - Same shape as `pinSection()`, minus `animation`.
 * @returns {{ scrollTrigger: ScrollTrigger, timeline: gsap.core.Timeline }|null}
 */
export function pinSectionWithTimeline(target, configure, options = {}) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el || typeof configure !== "function") return null;

  const timeline = gsap.timeline({ paused: true });
  configure(timeline);

  const scrollTrigger = pinSection(el, {
    ...options,
    scrub: options.scrub ?? 1,
    animation: timeline,
  });

  return scrollTrigger ? { scrollTrigger, timeline } : null;
}
