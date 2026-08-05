/**
 * Framer Motion — Fade Variants
 * Reusable variant factories for `<motion.*>` elements. Each factory
 * returns a standard `{ hidden, visible }` Framer Motion variants object,
 * intended for use with `initial="hidden"` and `animate`/`whileInView="visible"`.
 * Pure data — no components, hooks, or JSX live here.
 */

/** Default premium ease-out curve shared across the motion framework. */
export const EASE_PREMIUM = [0.16, 1, 0.3, 1];

/**
 * Builds a directional fade variant.
 *
 * @param {object} [options]
 * @param {"up"|"down"|"left"|"right"|"none"} [options.direction="up"]
 * @param {number} [options.distance=24] - Travel distance in pixels.
 * @param {number} [options.duration=0.6]
 * @param {number} [options.delay=0]
 * @param {number[]|string} [options.ease=EASE_PREMIUM]
 * @returns {{hidden: object, visible: object}}
 */
export function createFadeVariant(options = {}) {
  const {
    direction = "up",
    distance = 24,
    duration = 0.6,
    delay = 0,
    ease = EASE_PREMIUM,
  } = options;

  const offsets = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  const offset = offsets[direction] ?? offsets.up;
  const resolved = Object.fromEntries(Object.keys(offset).map((axis) => [axis, 0]));

  return {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      ...resolved,
      transition: { duration, delay, ease },
    },
  };
}

/** Simple opacity-only fade, no positional travel. */
export const fadeIn = createFadeVariant({ direction: "none" });

/** Fade in while rising from below — the default section/content reveal. */
export const fadeInUp = createFadeVariant({ direction: "up" });

/** Fade in while dropping from above — useful for nav/menu items. */
export const fadeInDown = createFadeVariant({ direction: "down" });

/** Fade in while sliding from the left. */
export const fadeInLeft = createFadeVariant({ direction: "left" });

/** Fade in while sliding from the right. */
export const fadeInRight = createFadeVariant({ direction: "right" });
