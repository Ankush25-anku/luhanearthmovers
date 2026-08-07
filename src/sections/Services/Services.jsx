"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";

import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import GlassCard from "@/components/common/GlassCard";
import Button from "@/components/common/Button";
import GridBackground from "@/components/common/GridBackground";
import NoiseOverlay from "@/components/common/NoiseOverlay";

import { SERVICE_CATEGORIES } from "@/data/services";
import { pinSectionWithTimeline } from "@/animations/gsap/pinSection";

// Navbar's own unscrolled height (src/components/navigation/Navbar.jsx: h-24).
// Used as the SSR-safe default and as a fallback if the header can't be measured.
const DEFAULT_NAVBAR_HEIGHT = 96;

/** Reads the fixed Navbar's real rendered height, falling back to the constant above. */
function measureNavbarHeight() {
  if (typeof document === "undefined") return DEFAULT_NAVBAR_HEIGHT;
  const header = document.querySelector("header");
  return header?.offsetHeight || DEFAULT_NAVBAR_HEIGHT;
}

// The category images are `fill`ed into an aspect-ratio-locked box, so their
// own load doesn't shift layout — but a refresh here is cheap insurance
// against the pin's measured start/end ever going stale relative to them.
let refreshFrame = null;
function scheduleServicesRefresh() {
  if (typeof window === "undefined") return;
  if (refreshFrame) cancelAnimationFrame(refreshFrame);
  refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
}

/**
 * One category's content — text column + glass placeholder. Fully data-driven.
 *
 * Mobile-only spacing/type-scale is deliberately tighter than tablet/desktop
 * (the `md:`/`lg:` values below are all unchanged from before): each mobile
 * card is single-column and has to fit title + description + a 3-item list
 * + CTA inside one pinned viewport-height screen, or the card's own
 * `overflow-y-auto` (Services.jsx) kicks in and the finger has to scroll the
 * *card's* content before the outer pinned transition can advance — that
 * competing inner/outer scroll is what read as "stuck," "late," and
 * "momentum broken". Every size used here is an existing design-system
 * token (text-h2, text-body, gap-2, mt-3, …), just a smaller one than
 * tablet/desktop use — no new scale was introduced.
 */
function ServiceCardContent({ category, reverse, isFirst }) {
  const textBlock = (
    <div>
      <h3 className="text-h2 text-text md:text-h1">{category.title}</h3>

      <p className="text-body mt-3 max-w-[var(--max-w-prose)] text-text-muted md:text-body-lg md:mt-5">
        {category.shortDescription}
      </p>

      <ul className="mt-5 flex flex-col gap-2 md:mt-8 md:gap-3">
        {category.services.map((service) => (
          <li key={service.slug} className="flex items-start gap-3">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="text-body text-text">{service.name}</span>
          </li>
        ))}
      </ul>

      <Button
        href={`/services/${category.slug}`}
        variant="outline"
        size="md"
        rightIcon={<ArrowRight aria-hidden="true" />}
        className="mt-6 md:mt-10"
      >
        {`Explore ${category.title}`}
      </Button>
    </div>
  );

  const placeholderBlock = (
    <GlassCard
      radius="2xl"
      padding="lg"
      // Mobile: a short, wide box (16/10) instead of the original 4/3 — the
      // image itself is object-contain (below) so this alone never crops
      // it, it just controls how much vertical space the card spends on the
      // image versus the text underneath. Tablet (md:) and desktop (lg:)
      // aspect ratios are untouched.
      className="relative aspect-[16/10] w-full overflow-hidden md:aspect-[3/4] lg:aspect-[4/5]"
    >
      <GridBackground />
      <NoiseOverlay />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 z-10 h-64 w-64 rounded-full bg-primary/25 blur-3xl"
      />
      <div className="relative z-20 h-full w-full">
        <Image
          src={category.image}
          alt={category.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          // Mobile: show the complete image, no cropping/zoom (letterboxed
          // into the same card on the grid/noise backdrop if the aspect
          // ratio doesn't match exactly). Tablet/desktop (md: and up)
          // keep the original object-cover fill unchanged.
          className="object-contain md:object-cover"
          // Only the first category is visible the instant the pinned
          // section is entered (the other two start off-screen below it) —
          // loading it eagerly avoids a pop-in if the user flings straight
          // into Services. Cards 2/3 stay lazy.
          priority={isFirst}
          onLoad={scheduleServicesRefresh}
        />
      </div>
    </GlassCard>
  );

  return (
    <Container maxWidth="content" className="w-full">
      <div className="grid grid-cols-1 items-center gap-5 md:gap-10 lg:grid-cols-2 lg:gap-20">
        {reverse ? (
          <>
            {placeholderBlock}
            {textBlock}
          </>
        ) : (
          <>
            {textBlock}
            {placeholderBlock}
          </>
        )}
      </div>
    </Container>
  );
}

export default function Services() {
  const pinTargetRef = useRef(null);
  const cardRefs = useRef([]);

  // Same pin + cover choreography at every breakpoint: each incoming card
  // scrubs its yPercent from 100 (fully below) to 0 (fully covering the
  // previous one). Previous cards are never touched again once in place —
  // no scale, no fade, no movement; they're simply covered by the next
  // opaque card on top. Only the pin distance scales down per tier
  // (100% desktop / 75% tablet / 50% mobile) — the mechanism itself,
  // including the pin, is identical everywhere.
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        isTablet: "(min-width: 768px) and (max-width: 1023px)",
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        const { isDesktop, isTablet, isMobile } = context.conditions;
        const cards = cardRefs.current.filter(Boolean);
        if (!cards.length) return undefined;

        // Pin must start below the fixed Navbar, and the pinned area's
        // height has to shrink to match — otherwise its bottom edge would
        // overshoot the viewport by the same amount.
        const navbarOffset = measureNavbarHeight();
        pinTargetRef.current?.style.setProperty("--navbar-offset", `${navbarOffset}px`);

        // Desktop unchanged (1). Tablet trimmed a bit further (0.9 → 0.75).
        // Mobile stays at roughly half (0.5, from an earlier pass) — same
        // card-cover effect, but reaching it takes noticeably less finger
        // travel, which is most of what "scroll feels heavy entering
        // Services" actually was: too much distance asked of a touch gesture.
        const distanceRatio = isDesktop ? 1 : isTablet ? 0.75 : 0.5;
        const distancePerCard = window.innerHeight * distanceRatio;
        // Desktop keeps its original scrub value exactly; a lighter scrub on
        // tablet/mobile tracks the finger more closely — same cover effect,
        // less scroll-linked recompute work per frame on weaker devices.
        const scrubAmount = isDesktop ? 1 : isTablet ? 0.6 : 0.5;

        cards.forEach((card, index) => {
          gsap.set(card, { yPercent: index === 0 ? 0 : 100 });
        });

        const result = pinSectionWithTimeline(
          pinTargetRef.current,
          (timeline) => {
            cards.forEach((card, index) => {
              if (index === 0) return;
              timeline.to(card, { yPercent: 0, ease: "none", duration: 1 }, index - 1);
            });
          },
          {
            start: () => `top top+=${navbarOffset}`,
            end: () => `+=${distancePerCard * (cards.length - 1)}`,
            scrub: scrubAmount,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // Only on mobile: if a fast fling scrolls past the pin's end in
            // a single tick, snap the timeline straight to its end state
            // instead of the scrub "catching up" over the next few frames —
            // that catch-up is exactly what read as delayed/jumpy on touch.
            // Desktop/tablet scroll velocities never realistically trigger
            // this, so their feel is unaffected either way.
            fastScrollEnd: isMobile,
          }
        );

        return () => result?.scrollTrigger?.kill();
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section id="services" aria-label="Our Services" className="section bg-background">
      <Container maxWidth="content">
        <SectionHeading
          eyebrow="OUR SERVICES"
          title="Engineering Solutions"
          description="From the first borehole to the final load test, VNS Prime Infra covers every stage of ground and foundation engineering — so your project is built on certainty."
          align="center"
        />
      </Container>

      <div
        ref={pinTargetRef}
        style={{ "--navbar-offset": `${DEFAULT_NAVBAR_HEIGHT}px` }}
        className="relative mt-16 h-[calc(100dvh-var(--navbar-offset))] overflow-hidden"
      >
        {SERVICE_CATEGORIES.map((category, index) => (
          <div
            key={category.slug}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            style={{ zIndex: index + 1 }}
            // Mobile: py-6 (was py-10) — the extra 32px went toward giving
            // the compacted content in ServiceCardContent more room to fit
            // one pinned viewport-height screen without needing this div's
            // own overflow-y-auto to kick in (that inner scroll, competing
            // with the outer pinned page-scroll for the same touch gesture,
            // was the "pin feels stuck / content appears late" bug).
            // overflow-y-auto stays as a safety net for any edge-case
            // content length, but the goal is for it to rarely engage.
            className="absolute inset-0 flex h-full items-start overflow-y-auto bg-background py-6 md:items-center md:py-0"
          >
            <ServiceCardContent
              category={category}
              reverse={index % 2 === 1}
              isFirst={index === 0}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
