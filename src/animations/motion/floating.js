/**
 * Framer Motion — Floating Variants
 * Reusable factories for subtle, infinite ambient motion (decorative
 * elements, stat cards, glass panels). Intended for use with the
 * `animate`/`transition` props directly (not `initial`/`whileInView`),
 * since the motion loops for as long as the element is mounted.
 */

/**
 * Builds a gentle vertical (or horizontal) float loop.
 *
 * @param {object} [options]
 * @param {"y"|"x"} [options.axis="y"]
 * @param {number} [options.distance=12] - Peak travel distance in pixels.
 * @param {number} [options.duration=6] - Seconds for one full cycle.
 * @param {number} [options.delay=0]
 * @param {string} [options.ease="easeInOut"]
 * @returns {{animate: object, transition: object}}
 */
export function createFloatingAnimation(options = {}) {
  const {
    axis = "y",
    distance = 12,
    duration = 6,
    delay = 0,
    ease = "easeInOut",
  } = options;

  return {
    animate: { [axis]: [0, -distance, 0] },
    transition: { duration, delay, ease, repeat: Infinity },
  };
}

/**
 * Builds a very slow, very subtle combined float + rotation, for large
 * background elements (glows, grid layers) where obvious motion would be
 * distracting.
 *
 * @param {object} [options]
 * @param {number} [options.distance=8]
 * @param {number} [options.rotate=1.5] - Peak rotation in degrees.
 * @param {number} [options.duration=10]
 * @param {number} [options.delay=0]
 * @param {string} [options.ease="easeInOut"]
 * @returns {{animate: object, transition: object}}
 */
export function createDriftAnimation(options = {}) {
  const {
    distance = 8,
    rotate = 1.5,
    duration = 10,
    delay = 0,
    ease = "easeInOut",
  } = options;

  return {
    animate: {
      y: [0, -distance, 0],
      rotate: [0, rotate, 0],
    },
    transition: { duration, delay, ease, repeat: Infinity },
  };
}

/** Default subtle vertical float — the common case for stat cards/panels. */
export const floatSubtle = createFloatingAnimation({ distance: 10, duration: 6 });

/** Slower, larger-amplitude float for hero-scale imagery. */
export const floatSlow = createFloatingAnimation({ distance: 18, duration: 9 });
