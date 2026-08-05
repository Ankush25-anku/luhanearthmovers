/**
 * GSAP Parallax Animations
 * Reusable scroll-scrubbed parallax helpers built on GSAP + ScrollTrigger.
 * All functions return the created Tween(s) so the caller can `.kill()`
 * them on cleanup — no hooks or components live in this module.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Moves a single element along one axis as its trigger scrolls through the
 * viewport, producing a classic parallax drift. Positive `speed` moves the
 * element opposite to scroll direction (background feel); negative `speed`
 * moves it with scroll direction, faster than the page (foreground feel).
 *
 * @param {string|Element} target
 * @param {object} [options]
 * @param {string|Element} [options.trigger] - Defaults to `target`.
 * @param {"y"|"x"} [options.axis="y"] - Axis to move along.
 * @param {number} [options.speed=0.3] - Movement strength, roughly in
 *   fractions of the trigger's own height/width.
 * @param {string} [options.start="top bottom"]
 * @param {string} [options.end="bottom top"]
 * @param {number|boolean} [options.scrub=true] - `true`, or a smoothing
 *   duration in seconds.
 * @param {string} [options.ease="none"]
 * @param {boolean} [options.markers=false]
 * @returns {gsap.core.Tween|null}
 */
export function parallax(target, options = {}) {
  const {
    trigger,
    axis = "y",
    speed = 0.3,
    start = "top bottom",
    end = "bottom top",
    scrub = true,
    ease = "none",
    markers = false,
  } = options;

  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return null;

  const triggerEl = trigger
    ? typeof trigger === "string"
      ? document.querySelector(trigger)
      : trigger
    : el;

  const distance = () => triggerEl.offsetHeight * speed;

  return gsap.to(el, {
    [axis]: () => distance(),
    ease,
    scrollTrigger: {
      trigger: triggerEl,
      start,
      end,
      scrub,
      markers,
      invalidateOnRefresh: true,
    },
  });
}

/**
 * Applies `parallax()` to every element matched by `selector`, reading a
 * per-element speed from a `data-parallax-speed` attribute (falling back to
 * `options.speed`). Useful for decorative layers (blobs, grid, imagery)
 * that should drift at different rates within the same section.
 *
 * @param {string} selector
 * @param {object} [options] - Same shape as `parallax()`, minus `target`.
 * @returns {gsap.core.Tween[]}
 */
export function parallaxGroup(selector, options = {}) {
  const { speed = 0.3, ...rest } = options;
  const elements = typeof window !== "undefined" ? gsap.utils.toArray(selector) : [];

  return elements
    .map((el) => {
      const dataSpeed = Number.parseFloat(el.dataset.parallaxSpeed);
      const elementSpeed = Number.isFinite(dataSpeed) ? dataSpeed : speed;
      return parallax(el, { ...rest, speed: elementSpeed });
    })
    .filter(Boolean);
}
