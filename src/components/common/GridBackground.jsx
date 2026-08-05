/**
 * GridBackground
 * Reusable "engineering blueprint" grid background — pure CSS, no image
 * assets. Absolutely positioned; render it as the first child inside a
 * `relative` (or `isolate`) parent so it sits behind the section content.
 *
 * @param {string} [className] - Additional classes merged onto the layer.
 * @param {boolean} [fade=true] - Fades the grid toward the edges via a
 *   radial mask so it doesn't create hard borders on large sections.
 */
export default function GridBackground({ className = "", fade = true }) {
  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none absolute inset-0 z-0",
        fade ? "bg-grid-fade" : "bg-grid",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
