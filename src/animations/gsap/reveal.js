/**
 * GSAP Reveal Animations
 * Reusable, framework-agnostic reveal helpers built on GSAP + ScrollTrigger.
 * Every function accepts a DOM element (or selector string) and an options
 * object, and returns the underlying GSAP Tween/Timeline so the caller can
 * `.kill()` it (e.g. inside a React `useEffect` cleanup — no hooks live here).
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Resolves a selector string or element/NodeList into an element array. */
function resolveTargets(target) {
  if (!target) return [];
  if (typeof target === "string") return gsap.utils.toArray(target);
  if (target instanceof Element) return [target];
  return gsap.utils.toArray(target);
}

/**
 * Builds the shared ScrollTrigger config used by the reveal helpers below.
 * Pass `scrollTrigger: false` to play immediately instead (e.g. above-the-fold content).
 */
function buildScrollTrigger(trigger, { start = "top 85%", end, once = true, markers = false } = {}) {
  return {
    trigger,
    start,
    end,
    toggleActions: once ? "play none none none" : "play none none reverse",
    markers,
  };
}

/**
 * Fades an element in while sliding it up from `y` pixels below its
 * resting position — the workhorse reveal for headings, paragraphs, cards.
 *
 * @param {string|Element|Element[]} target
 * @param {object} [options]
 * @param {number} [options.y=40] - Starting vertical offset in pixels.
 * @param {number} [options.duration=1]
 * @param {number} [options.delay=0]
 * @param {number} [options.stagger=0] - Stagger between multiple targets.
 * @param {string} [options.ease="power3.out"]
 * @param {string} [options.start="top 85%"] - ScrollTrigger start position.
 * @param {boolean} [options.once=true] - Play once vs. replay on re-entry.
 * @param {boolean} [options.scrollTrigger=true] - Set false to play immediately.
 * @param {boolean} [options.markers=false] - Debug ScrollTrigger markers.
 * @returns {gsap.core.Tween|null}
 */
export function fadeUp(target, options = {}) {
  const {
    y = 40,
    duration = 1,
    delay = 0,
    stagger = 0,
    ease = "power3.out",
    start = "top 85%",
    once = true,
    scrollTrigger = true,
    markers = false,
  } = options;

  const targets = resolveTargets(target);
  if (!targets.length) return null;

  return gsap.fromTo(
    targets,
    { autoAlpha: 0, y },
    {
      autoAlpha: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease,
      scrollTrigger: scrollTrigger
        ? buildScrollTrigger(targets[0], { start, once, markers })
        : undefined,
    }
  );
}

/**
 * Fades an element in while its CSS blur resolves to zero — a softer,
 * more cinematic reveal for hero imagery and large display type.
 *
 * @param {string|Element|Element[]} target
 * @param {object} [options]
 * @param {number} [options.blur=16] - Starting blur radius in pixels.
 * @param {number} [options.y=0] - Optional accompanying vertical offset.
 * @param {number} [options.duration=1.2]
 * @param {number} [options.delay=0]
 * @param {number} [options.stagger=0]
 * @param {string} [options.ease="power2.out"]
 * @param {string} [options.start="top 85%"]
 * @param {boolean} [options.once=true]
 * @param {boolean} [options.scrollTrigger=true]
 * @param {boolean} [options.markers=false]
 * @returns {gsap.core.Tween|null}
 */
export function blurReveal(target, options = {}) {
  const {
    blur = 16,
    y = 0,
    duration = 1.2,
    delay = 0,
    stagger = 0,
    ease = "power2.out",
    start = "top 85%",
    once = true,
    scrollTrigger = true,
    markers = false,
  } = options;

  const targets = resolveTargets(target);
  if (!targets.length) return null;

  return gsap.fromTo(
    targets,
    { autoAlpha: 0, y, filter: `blur(${blur}px)` },
    {
      autoAlpha: 1,
      y: 0,
      filter: "blur(0px)",
      duration,
      delay,
      stagger,
      ease,
      scrollTrigger: scrollTrigger
        ? buildScrollTrigger(targets[0], { start, once, markers })
        : undefined,
    }
  );
}

/**
 * Reveals an entire section as a composite timeline: the section container
 * fades/slides in first, then its children stagger in behind it. Ideal for
 * "section enters, then its content cascades" choreography.
 *
 * @param {string|Element} container
 * @param {object} [options]
 * @param {string} [options.childrenSelector=":scope > *"] - Children to stagger.
 * @param {number} [options.y=32] - Container's starting vertical offset.
 * @param {number} [options.childY=24] - Children's starting vertical offset.
 * @param {number} [options.duration=0.9]
 * @param {number} [options.childDuration=0.7]
 * @param {number} [options.stagger=0.12] - Stagger between children.
 * @param {string} [options.ease="power3.out"]
 * @param {string} [options.start="top 80%"]
 * @param {boolean} [options.once=true]
 * @param {boolean} [options.markers=false]
 * @returns {gsap.core.Timeline|null}
 */
export function sectionReveal(container, options = {}) {
  const {
    childrenSelector = ":scope > *",
    y = 32,
    childY = 24,
    duration = 0.9,
    childDuration = 0.7,
    stagger = 0.12,
    ease = "power3.out",
    start = "top 80%",
    once = true,
    markers = false,
  } = options;

  const el = typeof container === "string" ? document.querySelector(container) : container;
  if (!el) return null;

  const children = gsap.utils.toArray(childrenSelector, el);

  const timeline = gsap.timeline({
    scrollTrigger: buildScrollTrigger(el, { start, once, markers }),
    defaults: { ease },
  });

  timeline.fromTo(el, { autoAlpha: 0, y }, { autoAlpha: 1, y: 0, duration });

  if (children.length) {
    timeline.fromTo(
      children,
      { autoAlpha: 0, y: childY },
      { autoAlpha: 1, y: 0, duration: childDuration, stagger },
      "-=" + duration * 0.6
    );
  }

  return timeline;
}
