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
import { fadeUp } from "@/animations/gsap/reveal";

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
 * (the `md:`/`lg:` values below are all unchanged from before) — a holdover
 * from when mobile cards had to fit a pinned viewport-height screen. Mobile
 * no longer pins (see Services() below), so this is no longer a hard
 * requirement, just a kept, already-working compact treatment. Every size
 * used here is an existing design-system token (text-h2, text-body, gap-2,
 * mt-3, …), just a smaller one than tablet/desktop use — no new scale was
 * introduced.
 *
 * `data-service-image`/`data-service-content` are query targets for the
 * mobile-only fadeUp reveal in Services() — not used by the desktop/tablet
 * pin mechanic, which animates the whole card instead.
 */
function ServiceCardContent({ category, reverse, isFirst }) {
  const textBlock = (
    <div data-service-content>
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
    <div data-service-image>
      <GlassCard
        radius="2xl"
        padding="lg"
        // Mobile is no longer height-constrained (it isn't pinned — see
        // Services() below), so its box can be a normal, generous
        // photographic ratio again instead of the short 16/10 a pinned
        // viewport-height screen used to require. object-contain still
        // guarantees the full image is visible either way. Tablet (md:) and
        // desktop (lg:) aspect ratios are untouched.
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
            // Mobile: show the complete image, no cropping/zoom. Tablet/
            // desktop (md: and up) keep the original object-cover fill
            // unchanged.
            className="object-contain md:object-cover"
            // The first category is the first thing visible when the user
            // reaches Services (mobile: first in normal flow; desktop/
            // tablet: the only card in place when the pin engages) —
            // loading it eagerly avoids a pop-in. Cards 2/3 stay lazy.
            priority={isFirst}
            onLoad={scheduleServicesRefresh}
          />
        </div>
      </GlassCard>
    </div>
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

  // Desktop/tablet keep the original pin + cover choreography completely
  // untouched: each incoming card scrubs its yPercent from 100 (fully
  // below) to 0 (fully covering the previous one).
  //
  // Mobile no longer pins at all. A pinned, scrubbed transition (even the
  // lighter crossfade tried in an earlier pass) still depends on
  // ScrollTrigger's pin boundaries staying accurate through rapid, reversed
  // finger scrolling — exactly the condition real touch devices handle
  // worst, which is what "scroll up suddenly → stuck/jumps/hangs" was.
  // Removing the pin removes that whole failure class: mobile cards are
  // normal, static, in-flow sections, and each one just reveals once via
  // the shared `fadeUp` helper when it scrolls into view — no scrub, no
  // pin, no long scroll distance, nothing for a direction reversal to
  // desynchronize.
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        isTablet: "(min-width: 768px) and (max-width: 1023px)",
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        const { isDesktop, isMobile } = context.conditions;
        const cards = cardRefs.current.filter(Boolean);
        if (!cards.length) return undefined;

        if (isMobile) {
          const tweens = cards
            .flatMap((card) => {
              const image = card.querySelector("[data-service-image]");
              const content = card.querySelector("[data-service-content]");
              return [
                fadeUp(image, { y: 40, duration: 0.8, start: "top 85%", once: true }),
                fadeUp(content, { y: 30, duration: 0.7, delay: 0.1, start: "top 85%", once: true }),
              ];
            })
            .filter(Boolean);

          return () => {
            tweens.forEach((tween) => {
              tween.scrollTrigger?.kill();
              tween.kill();
            });
          };
        }

        // Desktop/tablet — byte-for-byte the same mechanism as before.
        // Pin must start below the fixed Navbar, and the pinned area's
        // height has to shrink to match — otherwise its bottom edge would
        // overshoot the viewport by the same amount.
        const navbarOffset = measureNavbarHeight();
        pinTargetRef.current?.style.setProperty("--navbar-offset", `${navbarOffset}px`);

        const distanceRatio = isDesktop ? 1 : 0.75;
        const distancePerCard = window.innerHeight * distanceRatio;
        const scrubAmount = isDesktop ? 1 : 0.6;

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

      {/* Mobile: plain, auto-height, normal-flow wrapper — no pin, no fixed
          viewport height, no hidden overflow. Tablet (md:) and desktop
          (lg: inherits md:) restore the exact original pinned-stack sizing. */}
      <div
        ref={pinTargetRef}
        style={{ "--navbar-offset": `${DEFAULT_NAVBAR_HEIGHT}px` }}
        className="relative mt-16 md:h-[calc(100dvh-var(--navbar-offset))] md:overflow-hidden"
      >
        {SERVICE_CATEGORIES.map((category, index) => (
          <div
            key={category.slug}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            style={{ zIndex: index + 1 }}
            // Mobile: each card is a normal, static, in-flow block — its
            // own vertical section, not absolutely stacked inside a pinned
            // container. md:/lg: below reproduce the original pinned-stack
            // styling for tablet/desktop exactly (absolute, full height,
            // centered, its own inner scroll safety net).
            className="relative bg-background py-16 md:absolute md:inset-0 md:flex md:h-full md:items-center md:overflow-y-auto md:py-0"
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
