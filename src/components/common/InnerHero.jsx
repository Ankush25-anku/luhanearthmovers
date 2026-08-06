"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

import Container from "./Container";
import NoiseOverlay from "./NoiseOverlay";

import { blurReveal, fadeUp } from "@/animations/gsap/reveal";

/**
 * InnerHero
 * Shared cinematic banner for every inner page — full-bleed background
 * image, dark gradient overlay, large title with an orange accent line,
 * and a breadcrumb trail. Plays its reveal immediately on mount (it's
 * always above the fold), reusing the site's existing GSAP reveal
 * helpers rather than bespoke animation code.
 *
 * @param {string} title - Page title shown large in the banner.
 * @param {{label: string, href?: string}[]} breadcrumbs - Trail, in order.
 *   The last entry (current page) renders as plain text even if it has an href.
 * @param {string} image - Background image src.
 * @param {string} [imageAlt=""] - Alt text; leave empty for a purely decorative banner.
 */
export default function InnerHero({ title, breadcrumbs = [], image, imageAlt = "" }) {
  const titleRef = useRef(null);
  const lineRef = useRef(null);
  const crumbRef = useRef(null);

  useEffect(() => {
    const tweens = [
      fadeUp(lineRef.current, { y: 0, duration: 0.6, scrollTrigger: false }),
      blurReveal(titleRef.current, {
        blur: 14,
        y: 24,
        duration: 1,
        delay: 0.1,
        scrollTrigger: false,
      }),
      fadeUp(crumbRef.current, {
        y: 16,
        duration: 0.7,
        delay: 0.45,
        scrollTrigger: false,
      }),
    ].filter(Boolean);

    return () => tweens.forEach((tween) => tween.kill());
  }, []);

  return (
    <section
      aria-label={title}
      className="relative flex h-[280px] w-full items-center overflow-hidden bg-background-secondary md:h-[350px] lg:h-[450px]"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <NoiseOverlay />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/35 to-transparent" />
      </div>

      <Container maxWidth="content" className="relative z-10">
        <span
          ref={lineRef}
          aria-hidden="true"
          className="block h-1 w-16 rounded-full bg-primary"
        />

        <h1 ref={titleRef} className="text-display mt-5 text-text">
          {title}
        </h1>

        <nav ref={crumbRef} aria-label="Breadcrumb" className="mt-5">
          <ol className="flex flex-wrap items-center gap-2 text-body text-text-muted">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <li key={crumb.label} className="flex items-center gap-2">
                  {index > 0 ? (
                    <ChevronRight
                      className="h-3.5 w-3.5 text-text-muted/60"
                      aria-hidden="true"
                    />
                  ) : null}
                  {crumb.href && !isLast ? (
                    <Link href={crumb.href} className="hover:text-primary">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      aria-current={isLast ? "page" : undefined}
                      className={isLast ? "text-primary" : ""}
                    >
                      {crumb.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </Container>
    </section>
  );
}
