/**
 * NoiseOverlay
 * Reusable film-grain texture layer — pure CSS (a procedural SVG
 * feTurbulence data URI), no image assets. Absolutely positioned; render it
 * as the last child inside a `relative` (or `isolate`) parent so it sits on
 * top of the section content at very low opacity.
 *
 * @param {string} [className] - Additional classes merged onto the layer.
 * @param {number} [opacity=0.035] - Grain strength; keep this very low.
 */

// Procedural noise pattern (fractal turbulence), generated at build time —
// not a bitmap asset. backgroundImage/opacity are set inline because their
// values are dynamic and can't be expressed as static Tailwind classes.
const NOISE_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function NoiseOverlay({ className = "", opacity = 0.035 }) {
  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none absolute inset-0 z-10 mix-blend-overlay",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ backgroundImage: NOISE_DATA_URI, opacity }}
    />
  );
}
