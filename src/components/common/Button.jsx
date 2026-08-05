"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";

/**
 * Button
 * Core reusable action component. Renders a Next.js `Link` when `href` is
 * given, otherwise a native `<button>`. Static by design — no transitions
 * or motion are applied here; interactive/animated wrappers (magnetic
 * hover, etc.) compose on top of this in src/components/ui.
 *
 * @param {React.ReactNode} children - Button label.
 * @param {"primary"|"secondary"|"outline"|"ghost"} [variant="primary"]
 * @param {"sm"|"md"|"lg"} [size="md"]
 * @param {React.ReactNode} [leftIcon] - Icon element rendered before the label.
 * @param {React.ReactNode} [rightIcon] - Icon element rendered after the label.
 * @param {boolean} [loading=false] - Shows a spinner and disables the button.
 * @param {boolean} [disabled=false]
 * @param {string} [href] - When set, renders as a Link instead of a button.
 * @param {() => void} [onClick]
 * @param {string} [className] - Additional classes merged onto the button.
 * @param {"button"|"submit"|"reset"} [type="button"] - Ignored when `href` is set.
 */

const VARIANT_CLASSES = {
  primary:
    "bg-gradient-to-r from-primary to-accent text-background shadow-glow-primary hover:shadow-glow-strong",
  secondary: "bg-surface text-text border border-border hover:bg-surface-hover",
  outline: "bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-background",
  ghost: "bg-transparent text-text hover:bg-surface hover:text-primary",
};

const SIZE_CLASSES = {
  sm: "h-11 px-5 text-sm gap-1.5 [&_svg]:h-4 [&_svg]:w-4",
  md: "h-12 px-7 text-sm gap-2 [&_svg]:h-4 [&_svg]:w-4",
  lg: "h-14 px-9 text-base gap-2.5 [&_svg]:h-5 [&_svg]:w-5",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  href,
  onClick,
  className = "",
  type = "button",
  ...rest
}) {
  const isDisabled = disabled || loading;

  const classes = [
    "inline-flex items-center justify-center rounded-full font-body font-semibold select-none whitespace-nowrap",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none",
    VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.primary,
    SIZE_CLASSES[size] ?? SIZE_CLASSES.md,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {loading ? (
        <Loader2 className="animate-spin" aria-hidden="true" />
      ) : (
        leftIcon ?? null
      )}
      <span>{children}</span>
      {!loading ? rightIcon ?? null : null}
    </>
  );

  if (href && !isDisabled) {
    return (
      <Link
        href={href}
        className={classes}
        aria-disabled={isDisabled}
        {...rest}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      className={classes}
      {...rest}
    >
      {content}
    </button>
  );
}
