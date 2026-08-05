/**
 * GSAP Horizontal Scroll
 * Reusable helper that pins a container and translates an inner track
 * horizontally as the user scrolls vertically past it — the classic
 * "horizontal scroll section" pattern (galleries, project showcases).
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * @param {string|Element} container - The section to pin.
 * @param {object} [options]
 * @param {string} [options.trackSelector=":scope > *"] - The scrollable
 *   track inside `container`; defaults to its first child.
 * @param {boolean} [options.pin=true]
 * @param {number|boolean} [options.scrub=1]
 * @param {string} [options.start="top top"]
 * @param {string} [options.ease="none"]
 * @param {boolean} [options.markers=false]
 * @param {number} [options.extraScroll=0] - Extra pixels of scroll distance
 *   appended after the track's natural overflow (breathing room at the end).
 * @returns {gsap.core.Tween|null} The horizontal tween; `.scrollTrigger` on
 *   it exposes the underlying ScrollTrigger instance for further control.
 */
export function horizontalScroll(container, options = {}) {
  const {
    trackSelector = ":scope > *",
    pin = true,
    scrub = 1,
    start = "top top",
    ease = "none",
    markers = false,
    extraScroll = 0,
  } = options;

  const containerEl =
    typeof container === "string" ? document.querySelector(container) : container;
  if (!containerEl) return null;

  const track = containerEl.querySelector(trackSelector) ?? containerEl.firstElementChild;
  if (!track) return null;

  const getScrollDistance = () =>
    track.scrollWidth - containerEl.clientWidth + extraScroll;

  return gsap.to(track, {
    x: () => -getScrollDistance(),
    ease,
    scrollTrigger: {
      trigger: containerEl,
      start,
      end: () => `+=${getScrollDistance()}`,
      pin,
      scrub,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      markers,
    },
  });
}
