/**
 * Framer Motion — Stagger Variants
 * Reusable container/item variant pairs for staggered reveals — apply the
 * container variant to the parent `<motion.*>` (with `initial="hidden"` and
 * `animate`/`whileInView="visible"`) and the item variant to each direct
 * `<motion.*>` child. Pure data — no components or hooks.
 */

import { EASE_PREMIUM } from "./fade";

/**
 * Builds a stagger container variant. It carries no visual styling itself —
 * it only orchestrates timing for its children's own variants.
 *
 * @param {object} [options]
 * @param {number} [options.staggerChildren=0.08] - Delay between each child.
 * @param {number} [options.delayChildren=0] - Delay before the first child starts.
 * @param {"forwards"|"reverse"} [options.staggerDirection="forwards"]
 * @returns {{hidden: object, visible: object}}
 */
export function createStaggerContainer(options = {}) {
  const {
    staggerChildren = 0.08,
    delayChildren = 0,
    staggerDirection = "forwards",
  } = options;

  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren,
        staggerDirection: staggerDirection === "reverse" ? -1 : 1,
      },
    },
  };
}

/**
 * Builds the matching item variant for children of a stagger container.
 *
 * @param {object} [options]
 * @param {number} [options.distance=16] - Vertical travel in pixels.
 * @param {number} [options.duration=0.5]
 * @param {number[]|string} [options.ease=EASE_PREMIUM]
 * @returns {{hidden: object, visible: object}}
 */
export function createStaggerItem(options = {}) {
  const { distance = 16, duration = 0.5, ease = EASE_PREMIUM } = options;

  return {
    hidden: { opacity: 0, y: distance },
    visible: { opacity: 1, y: 0, transition: { duration, ease } },
  };
}

/** Common preset: tight stagger for nav links, list items, badges. */
export const staggerContainerTight = createStaggerContainer({ staggerChildren: 0.05 });

/** Common preset: relaxed stagger for large cards/sections. */
export const staggerContainerRelaxed = createStaggerContainer({ staggerChildren: 0.15 });

/** Common preset item, paired with either container above. */
export const staggerItem = createStaggerItem();
