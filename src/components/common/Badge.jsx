/**
 * Badge
 * Small uppercase pill label used as a section eyebrow or status tag
 * (e.g. "ABOUT VNS PRIME INFRA").
 *
 * @param {React.ReactNode} children
 * @param {string} className - Additional classes merged onto the badge.
 */
export default function Badge({ children, className = "" }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border border-primary/60 px-4 py-1.5",
        "text-caption text-primary",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
