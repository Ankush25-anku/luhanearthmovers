/**
 * Framer Motion — Hover Variants
 * Reusable state objects for `whileHover` / `whileTap` on `<motion.*>`
 * elements (buttons, cards, links). Pure data — no components or hooks.
 */

import { EASE_PREMIUM } from "./fade";

const DEFAULT_TRANSITION = { duration: 0.3, ease: EASE_PREMIUM };

/**
 * Builds a scale-on-hover state, with a matching (slightly smaller) tap state.
 *
 * @param {object} [options]
 * @param {number} [options.hoverScale=1.04]
 * @param {number} [options.tapScale=0.97]
 * @param {object} [options.transition=DEFAULT_TRANSITION]
 * @returns {{whileHover: object, whileTap: object}}
 */
export function createHoverScale(options = {}) {
  const {
    hoverScale = 1.04,
    tapScale = 0.97,
    transition = DEFAULT_TRANSITION,
  } = options;

  return {
    whileHover: { scale: hoverScale, transition },
    whileTap: { scale: tapScale, transition: { ...transition, duration: 0.15 } },
  };
}

/**
 * Builds a lift-on-hover state (moves up, adds shadow) for cards.
 *
 * @param {object} [options]
 * @param {number} [options.distance=8] - Upward travel in pixels.
 * @param {string} [options.shadow="0 24px 48px rgba(0,0,0,0.35)"]
 * @param {object} [options.transition=DEFAULT_TRANSITION]
 * @returns {{whileHover: object}}
 */
export function createHoverLift(options = {}) {
  const {
    distance = 8,
    shadow = "0 24px 48px rgba(0,0,0,0.35)",
    transition = DEFAULT_TRANSITION,
  } = options;

  return {
    whileHover: { y: -distance, boxShadow: shadow, transition },
  };
}

/**
 * Builds a hover state that nudges an element sideways — handy for CTA
 * arrows/icons that should slide toward the reading direction on hover.
 *
 * @param {object} [options]
 * @param {number} [options.distance=6]
 * @param {"right"|"left"} [options.direction="right"]
 * @param {object} [options.transition=DEFAULT_TRANSITION]
 * @returns {{whileHover: object}}
 */
export function createHoverNudge(options = {}) {
  const { distance = 6, direction = "right", transition = DEFAULT_TRANSITION } = options;
  const x = direction === "right" ? distance : -distance;

  return {
    whileHover: { x, transition },
  };
}

/** Common preset: subtle scale for primary buttons. */
export const hoverScaleSubtle = createHoverScale({ hoverScale: 1.03, tapScale: 0.98 });

/** Common preset: card lift for GlassCard-style surfaces. */
export const hoverLiftCard = createHoverLift({ distance: 6 });

/** Common preset: icon nudge for "→" style CTA arrows. */
export const hoverNudgeArrow = createHoverNudge({ distance: 4 });
