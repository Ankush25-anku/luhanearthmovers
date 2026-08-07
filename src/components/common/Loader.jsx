"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import { COMPANY } from "@/data/company";

/**
 * Loader
 * Full-screen premium loading overlay — dark background, a growing/
 * shrinking orange accent line, brand name, and a short status line. Purely
 * presentational: mounting/unmounting (and any exit fade) is the caller's
 * responsibility — this component only owns its own entrance fade and the
 * line's infinite pulse for as long as it's mounted.
 */
export default function Loader() {
  const lineRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );

      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed inset-0 z-[var(--z-max)] flex items-center justify-center bg-background">
      <div ref={contentRef} className="flex flex-col items-center gap-5 px-6 text-center">
        <span
          ref={lineRef}
          aria-hidden="true"
          className="h-[2px] w-20 origin-left rounded-full bg-primary"
        />
        <div>
          <p className="font-heading text-sm font-semibold tracking-[0.25em] text-text uppercase">
            {COMPANY.name}
          </p>
          <p className="text-caption mt-2 tracking-[0.15em] text-text-muted">
            Preparing Experience...
          </p>
        </div>
      </div>
    </div>
  );
}
