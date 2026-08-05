/**
 * Container
 * Reusable responsive layout wrapper. Centers content and applies the
 * design system's responsive horizontal padding (24px / 32px / 48px).
 *
 * @param {"page"|"content"|"narrow"|"prose"|"full"|string} maxWidth
 *   Named preset (defaults to "page", 1440px) or a raw CSS length
 *   (e.g. "1100px") for one-off cases.
 * @param {string} className - Additional classes merged onto the wrapper.
 * @param {React.ReactNode} children
 */

const MAX_WIDTH_PRESETS = {
  page: "max-w-[var(--max-w-page)]",
  content: "max-w-[var(--max-w-content)]",
  narrow: "max-w-[var(--max-w-narrow)]",
  prose: "max-w-[var(--max-w-prose)]",
  full: "max-w-none",
};

export default function Container({ children, maxWidth = "page", className = "" }) {
  const presetClass = MAX_WIDTH_PRESETS[maxWidth];

  return (
    <div
      className={[
        "mx-auto w-full px-6 md:px-8 lg:px-12",
        presetClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      // Only reached for a custom, non-preset length — Tailwind can't
      // resolve a dynamic arbitrary-value class at build time.
      style={presetClass ? undefined : { maxWidth }}
    >
      {children}
    </div>
  );
}
