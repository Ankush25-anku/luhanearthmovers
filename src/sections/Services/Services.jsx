"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
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

/** One category's content — text column + glass placeholder. Fully data-driven. */
function ServiceCardContent({ category, reverse }) {
  const textBlock = (
    <div>
      <h3 className="text-h1 text-text">{category.title}</h3>

      <p className="text-body-lg mt-5 max-w-[var(--max-w-prose)] text-text-muted">
        {category.shortDescription}
      </p>

      <ul className="mt-8 flex flex-col gap-3">
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
        className="mt-10"
      >
        {`Explore ${category.title}`}
      </Button>
    </div>
  );

  const placeholderBlock = (
    <GlassCard
      radius="2xl"
      padding="lg"
      className="relative aspect-[4/3] w-full overflow-hidden md:aspect-[3/4] lg:aspect-[4/5]"
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
          className="object-cover"
        />
      </div>
    </GlassCard>
  );

  return (
    <Container maxWidth="content" className="w-full">
      <div className="grid grid-cols-1 items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-20">
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
  // (100% desktop / 90% tablet / 80% mobile) — the mechanism itself,
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
        const { isDesktop, isTablet } = context.conditions;
        const cards = cardRefs.current.filter(Boolean);
        if (!cards.length) return undefined;

        // Pin must start below the fixed Navbar, and the pinned area's
        // height has to shrink to match — otherwise its bottom edge would
        // overshoot the viewport by the same amount.
        const navbarOffset = measureNavbarHeight();
        pinTargetRef.current?.style.setProperty("--navbar-offset", `${navbarOffset}px`);

        const distanceRatio = isDesktop ? 1 : isTablet ? 0.9 : 0.8;
        const distancePerCard = window.innerHeight * distanceRatio;
        // Desktop keeps its original scrub value exactly; a lighter scrub on
        // tablet/mobile tracks the finger more closely — same cover effect,
        // less scroll-linked recompute work per frame on weaker devices.
        const scrubAmount = isDesktop ? 1 : isTablet ? 0.7 : 0.5;

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
            className="absolute inset-0 flex h-full items-start overflow-y-auto bg-background py-10 md:items-center md:py-0"
          >
            <ServiceCardContent category={category} reverse={index % 2 === 1} />
          </div>
        ))}
      </div>
    </section>
  );
}
