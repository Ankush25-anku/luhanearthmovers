/**
 * GSAP Animated Counters
 * Reusable helpers for counting numbers up (e.g. "15+ Years", "500+
 * Projects") as they scroll into view, without relying on React state.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Formats a number with a fixed decimal count, thousands separator, prefix/suffix. */
function formatCount(value, { decimals, prefix, suffix, separator }) {
  const fixed = value.toFixed(decimals);
  const [integerPart, decimalPart] = fixed.split(".");
  const withSeparator = separator
    ? integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    : integerPart;
  return `${prefix}${withSeparator}${decimalPart ? `.${decimalPart}` : ""}${suffix}`;
}

/**
 * Animates the text content of `target` from one number to another.
 *
 * @param {string|Element} target - Element whose textContent is driven.
 * @param {object} [options]
 * @param {number} [options.from=0]
 * @param {number} [options.to=100]
 * @param {number} [options.duration=2]
 * @param {string} [options.ease="power2.out"]
 * @param {number} [options.decimals=0]
 * @param {string} [options.prefix=""]
 * @param {string} [options.suffix=""]
 * @param {string} [options.separator=","] - Thousands separator; pass "" to disable.
 * @param {string} [options.start="top 85%"] - ScrollTrigger start position.
 * @param {boolean} [options.once=true] - Play once vs. replay on re-entry.
 * @param {boolean} [options.scrollTrigger=true] - Set false to play immediately.
 * @param {boolean} [options.markers=false]
 * @returns {gsap.core.Tween|null}
 */
export function animateCounter(target, options = {}) {
  const {
    from = 0,
    to = 100,
    duration = 2,
    ease = "power2.out",
    decimals = 0,
    prefix = "",
    suffix = "",
    separator = ",",
    start = "top 85%",
    once = true,
    scrollTrigger = true,
    markers = false,
  } = options;

  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return null;

  const format = (value) => formatCount(value, { decimals, prefix, suffix, separator });
  const proxy = { value: from };
  el.textContent = format(from);

  return gsap.to(proxy, {
    value: to,
    duration,
    ease,
    onUpdate: () => {
      el.textContent = format(proxy.value);
    },
    scrollTrigger: scrollTrigger
      ? {
          trigger: el,
          start,
          toggleActions: once ? "play none none none" : "play reset play reset",
          markers,
        }
      : undefined,
  });
}

/**
 * Applies `animateCounter()` to every element matched by `selector`, reading
 * per-element config from data attributes so a whole stats grid can be
 * wired up with a single call:
 *
 *   data-count-to="150" data-count-from="0" data-count-duration="2"
 *   data-count-decimals="0" data-count-prefix="" data-count-suffix="+"
 *
 * @param {string} selector
 * @param {object} [options] - Fallback values for elements missing a
 *   matching data attribute; same shape as `animateCounter()`, minus `target`.
 * @returns {gsap.core.Tween[]}
 */
export function animateCounterGroup(selector, options = {}) {
  if (typeof window === "undefined") return [];

  const elements = gsap.utils.toArray(selector);

  return elements
    .map((el) => {
      const { count } = el.dataset;
      const data = el.dataset;

      return animateCounter(el, {
        ...options,
        from: data.countFrom !== undefined ? Number(data.countFrom) : options.from,
        to: data.countTo !== undefined ? Number(data.countTo) : (options.to ?? Number(count)),
        duration: data.countDuration !== undefined ? Number(data.countDuration) : options.duration,
        decimals: data.countDecimals !== undefined ? Number(data.countDecimals) : options.decimals,
        prefix: data.countPrefix ?? options.prefix,
        suffix: data.countSuffix ?? options.suffix,
      });
    })
    .filter(Boolean);
}
