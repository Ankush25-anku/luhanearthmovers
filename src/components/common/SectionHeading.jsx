import Badge from "./Badge";

/**
 * SectionHeading
 * Reusable eyebrow + title + description block used to open a page section.
 * Static — no entrance/scroll animation is applied here; wrap the rendered
 * output with GSAP/ScrollTrigger at the call site if a reveal is needed.
 *
 * @param {string} [eyebrow] - Short label rendered as a Badge above the title.
 * @param {string} title - Section heading text (required).
 * @param {string} [description] - Supporting paragraph below the title.
 * @param {"left"|"center"} [align="center"] - Text and block alignment.
 * @param {string} [className] - Additional classes merged onto the wrapper.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}) {
  const isCentered = align === "center";

  return (
    <div
      className={[
        "flex flex-col gap-5",
        isCentered ? "items-center text-center" : "items-start text-left",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {eyebrow ? <Badge>{eyebrow}</Badge> : null}

      <h2 className="text-h2 text-text">{title}</h2>

      {description ? (
        <p
          className={[
            "text-body-lg max-w-[var(--max-w-prose)] text-text-muted",
            isCentered ? "mx-auto" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
