"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { COMPANY } from "@/data/company";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const EYEBROW_TEXT = COMPANY.name; // "Luhan Earth Movers" — shown uppercase via CSS, persists across all 3 chapters

// Bespoke film-intro copy. Each heading/description is an array of lines —
// intentional editorial line breaks, not paragraph text that should
// reflow, so they're kept as explicit lines rather than one long string.
const CHAPTERS = [
  {
    heading: ["Building the Ground", "Where Progress Begins"],
    description: ["Heavy earthmoving and excavation", "solutions engineered for large scale projects."],
  },
  {
    heading: ["Power.", "Precision.", "Performance."],
    description: ["Advanced machinery.", "Experienced operators.", "Reliable infrastructure execution."],
  },
  {
    heading: ["Moving Earth.", "Creating Tomorrow."],
    description: ["Building foundations for", "modern infrastructure."],
  },
];

// Chapter boundaries as fractions of the Hero's own scroll progress —
// matches the 0–30 / 30–65 / 65–100% spec exactly.
function getChapterIndex(progress) {
  if (progress < 0.3) return 0;
  if (progress < 0.65) return 1;
  return 2;
}

/**
 * HeroContent
 * Three-chapter scroll storytelling layer on top of the frame sequence.
 * Never creates its own ScrollTrigger — HeroCanvas already owns the single
 * pinned ScrollTrigger for this section, so this component finds that
 * *existing* instance (by matching its `trigger` element) and polls its
 * live `.progress` off the shared `gsap.ticker` (the same clock Lenis is
 * already synced to — no extra rAF loop), purely to decide which chapter
 * should be showing. HeroCanvas, its ScrollTrigger, and the frame logic
 * are never touched or referenced beyond reading that one public number.
 */
export default function HeroContent() {
  const rootRef = useRef(null);
  const lineRef = useRef(null);
  const eyebrowRef = useRef(null);
  const chapterRefs = useRef([]);
  const indicatorGroupRef = useRef(null);
  const indicatorLineRef = useRef(null);
  const activeChapterRef = useRef(0);

  useEffect(() => {
    const section = rootRef.current?.closest("section");
    if (!section) return undefined;

    const chapters = chapterRefs.current.filter(Boolean);
    if (!chapters.length) return undefined;

    const ctx = gsap.context(() => {
      gsap.set(chapters, { autoAlpha: 0 });
      gsap.set(chapters[0], { y: 40, filter: "blur(10px)" });

      const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
      entrance
        .fromTo(lineRef.current, { scaleY: 0 }, { scaleY: 1, duration: 0.7 }, 0.1)
        .fromTo(eyebrowRef.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.25)
        .to(chapters[0], { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.9 }, 0.4)
        .fromTo(indicatorGroupRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 0.75);

      // Scroll indicator: infinite "drip" line (0 → 60px) + a slow overall
      // opacity pulse. Persistent chrome, not tied to chapter progress.
      gsap.to(indicatorLineRef.current, {
        height: 60,
        duration: 1.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(indicatorGroupRef.current, {
        opacity: 0.4,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });
    }, rootRef);

    /** Crossfades chapter `from` out and chapter `to` in. */
    function transitionTo(from, to) {
      const outgoing = chapters[from];
      const incoming = chapters[to];
      if (!incoming || outgoing === incoming) return;

      gsap.killTweensOf([outgoing, incoming].filter(Boolean));

      if (outgoing) {
        gsap.to(outgoing, { autoAlpha: 0, y: -40, duration: 0.6, ease: "power2.inOut" });
      }

      gsap.fromTo(
        incoming,
        { autoAlpha: 0, y: 40, filter: "blur(10px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power2.out" }
      );
    }

    // Polls the *existing* pinned ScrollTrigger HeroCanvas created for this
    // same <section> — re-resolved every tick (cheap: a handful of
    // instances, no DOM access) rather than cached, so it stays correct
    // even if HeroCanvas's own gsap.matchMedia re-creates its trigger on a
    // breakpoint change.
    const tick = () => {
      const heroTrigger = ScrollTrigger.getAll().find(
        (st) => st.trigger === section && st.vars.pin
      );
      if (!heroTrigger) return;

      const chapter = getChapterIndex(heroTrigger.progress);
      if (chapter !== activeChapterRef.current) {
        transitionTo(activeChapterRef.current, chapter);
        activeChapterRef.current = chapter;
      }
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 z-30">
      {/* Mobile: explicit left/right/bottom inset (not padding-on-a-full-
          width-bar) so the container is exactly as wide as the content
          needs to be — no top padding, no large vertical spacing. Tablet
          (md:) and desktop (lg:) revert to the original inset-x-0/padding
          approach, unchanged. */}
      <div className="absolute bottom-[90px] left-6 right-6 md:inset-x-0 md:bottom-0 md:px-10 md:pb-24 md:pt-24 lg:px-14 lg:pb-28">
        <div className="relative mx-auto w-full max-w-[var(--max-w-page)]">
          {/* Soft scrim sized to the text block only — no full-height/solid
              background, the bulldozer stays visible around and behind it. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-6 -inset-y-12 -z-10 bg-gradient-to-t from-background/55 via-background/15 to-transparent md:-inset-x-10 lg:-inset-x-14"
          />

          <span
            ref={lineRef}
            aria-hidden="true"
            className="block h-10 w-1 origin-top scale-y-0 rounded-full bg-primary md:h-12"
          />

          <p
            ref={eyebrowRef}
            className="mt-2 text-[0.65rem] tracking-[0.2em] text-primary uppercase md:mt-4 md:text-caption"
          >
            {EYEBROW_TEXT}
          </p>

          {/* All 3 chapters share one grid cell (row-start-1/col-start-1) so
              the block is always sized to whichever is tallest and bottom-
              aligned within it — GSAP crossfades which one is visible. */}
          <div className="mt-2 grid md:mt-4">
            {CHAPTERS.map((chapter, index) => (
              <div
                key={index}
                ref={(el) => {
                  chapterRefs.current[index] = el;
                }}
                className={[
                  "col-start-1 row-start-1 self-end justify-self-start",
                  index === 0 ? "" : "invisible opacity-0",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <h1
                  className={[
                    "font-heading font-bold uppercase text-text",
                    // Font size: distinct clamp() per tier, not one formula
                    // scaled continuously — mobile/tablet/desktop each need
                    // their own ceiling so the heading never overpowers the
                    // frame (desktop) or overflows it (mobile).
                    "text-[clamp(1.8rem,8vw,2.5rem)] md:text-[clamp(2.8rem,6vw,4rem)] lg:text-[clamp(3.5rem,5vw,5.5rem)]",
                    // Max-width caps how far the heading can stretch at each
                    // tier — narrow enough on mobile (280px) that each
                    // logical line wraps again naturally into 2–3 short
                    // sub-lines instead of running edge-to-edge.
                    "max-w-[280px] md:max-w-[650px] lg:max-w-[900px]",
                    // Line-height/letter-spacing both tighten as the type
                    // gets larger.
                    "leading-[0.95] tracking-[-0.03em] md:leading-[1.0] md:tracking-[-0.04em] lg:leading-[0.95]",
                  ].join(" ")}
                >
                  {chapter.heading.map((line, lineIndex) => (
                    <span key={lineIndex} className="block">
                      {line}
                    </span>
                  ))}
                </h1>

                <div className="mt-2 max-w-[300px] text-[0.85rem] leading-[1.5] text-text-muted md:mt-5 md:max-w-[var(--max-w-prose)] md:text-body-lg">
                  {chapter.description.map((line, lineIndex) => (
                    <span key={lineIndex} className="block">
                      {line}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={indicatorGroupRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 md:gap-3"
      >
        <span className="text-[0.6rem] tracking-[0.3em] text-text-muted uppercase md:text-caption">
          Scroll
        </span>
        {/* max-h-10 caps the GSAP-animated line at 40px on mobile (it still
            tweens toward 60px, just visually clamped smaller) — tablet/
            desktop are uncapped, so the animation itself is unchanged. */}
        <span
          ref={indicatorLineRef}
          className="max-h-10 w-px bg-primary md:max-h-none"
          style={{ height: 0 }}
        />
      </div>
    </div>
  );
}
