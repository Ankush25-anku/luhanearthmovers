/**
 * Framer Motion — Magnetic Variant
 * Reusable pure functions for building a "magnetic" hover effect (an
 * element subtly pulls toward the cursor within its bounds). These are
 * intentionally hook-free: wire them into a component's own
 * `onMouseMove` / `onMouseLeave` handlers and motion values there.
 */

/** Clamps `value` between `min` and `max`. */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Computes the magnetic offset for `element` given a pointer event,
 * pulling it toward the cursor with a falloff strength and hard cap.
 *
 * @param {{clientX: number, clientY: number}} event - A mouse/pointer event.
 * @param {Element} element - The magnetic element (offset is relative to its center).
 * @param {object} [options]
 * @param {number} [options.strength=0.4] - Fraction of cursor offset to apply (0–1).
 * @param {number} [options.maxOffset=16] - Maximum travel in pixels, per axis.
 * @returns {{x: number, y: number}}
 */
export function getMagneticOffset(event, element, options = {}) {
  const { strength = 0.4, maxOffset = 16 } = options;

  if (!element || typeof element.getBoundingClientRect !== "function") {
    return { x: 0, y: 0 };
  }

  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const deltaX = event.clientX - centerX;
  const deltaY = event.clientY - centerY;

  return {
    x: clamp(deltaX * strength, -maxOffset, maxOffset),
    y: clamp(deltaY * strength, -maxOffset, maxOffset),
  };
}

/** The rest (neutral) offset — apply on `onMouseLeave`. */
export function getMagneticRest() {
  return { x: 0, y: 0 };
}

/**
 * Builds the spring transition typically paired with magnetic offsets, so
 * the element settles back to rest with a natural, slightly bouncy feel.
 *
 * @param {object} [options]
 * @param {number} [options.stiffness=150]
 * @param {number} [options.damping=15]
 * @param {number} [options.mass=0.5]
 * @returns {{type: "spring", stiffness: number, damping: number, mass: number}}
 */
export function createMagneticTransition(options = {}) {
  const { stiffness = 150, damping = 15, mass = 0.5 } = options;
  return { type: "spring", stiffness, damping, mass };
}

/**
 * Convenience helper bundling offset + transition into the `animate` /
 * `transition` props a `<motion.*>` element needs for a magnetic hover.
 *
 * @param {{clientX: number, clientY: number}|null} event - Pass `null` (or
 *   omit) to return the rest state, e.g. on `onMouseLeave`.
 * @param {Element} element
 * @param {object} [options] - Combined options for offset + spring, see
 *   `getMagneticOffset()` and `createMagneticTransition()`.
 * @returns {{animate: {x: number, y: number}, transition: object}}
 */
export function getMagneticAnimateProps(event, element, options = {}) {
  const offset = event ? getMagneticOffset(event, element, options) : getMagneticRest();
  return {
    animate: offset,
    transition: createMagneticTransition(options),
  };
}
