/**
 * GlassCard
 * Reusable glass-morphism surface (blurred, translucent, bordered) built on
 * the design system's `.glass` utility. Static — no motion is applied; the
 * optional `hover` glow is an instant state change, not a transition.
 *
 * @param {React.ReactNode} children
 * @param {string} [className] - Additional classes merged onto the card.
 * @param {boolean} [hover=false] - Adds an orange glow on hover/focus.
 * @param {"sm"|"md"|"lg"} [padding="md"] - Inner spacing.
 * @param {"sm"|"md"|"lg"|"xl"|"2xl"|"full"} [radius="xl"] - Corner radius.
 */

const PADDING_CLASSES = {
  sm: "p-5",
  md: "p-8",
  lg: "p-10",
};

const RADIUS_CLASSES = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

export default function GlassCard({
  children,
  className = "",
  hover = false,
  padding = "md",
  radius = "xl",
}) {
  return (
    <div
      className={[
        "glass",
        RADIUS_CLASSES[radius] ?? RADIUS_CLASSES.xl,
        PADDING_CLASSES[padding] ?? PADDING_CLASSES.md,
        hover ? "hover:shadow-glow-primary focus-within:shadow-glow-primary" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
