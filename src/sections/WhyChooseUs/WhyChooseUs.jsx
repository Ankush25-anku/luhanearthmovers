"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import GlassCard from "@/components/common/GlassCard";
import GridBackground from "@/components/common/GridBackground";
import NoiseOverlay from "@/components/common/NoiseOverlay";

import { STATS } from "@/data/stats";

// STATS (src/data/stats.js) carries the number/suffix/label for each reason;
// it has no long-form copy, so the supporting sentence lives here, keyed by
// the same stat id.
const REASON_DESCRIPTIONS = {
  "years-experience":
    "Years of experience in foundation and ground engineering have helped Luhan Earth Movers deliver reliable solutions across diverse soil conditions and challenging construction environments.",

  "projects-completed":
    "From residential developments to commercial and infrastructure projects, Luhan Earth Movers provides specialized piling, excavation, and ground improvement solutions across Bangalore.",

  "piles-installed":
    "A proven record of successful piling works, including rotary piling, micropiling, and foundation solutions executed with precision and engineering expertise.",

  "safety-compliance":
    "Safety-driven execution with strict quality control, skilled professionals, and industry-focused processes to ensure every project is completed with reliability and confidence.",
};
function formatStatValue(value, stat) {
  const rounded = Math.round(value);
  return `${stat.prefix ?? ""}${rounded.toLocaleString()}${stat.suffix ?? ""}`;
}

export default function WhyChooseUs() {
  const blockRefs = useRef([]);

  // Same reversible ScrollTrigger timeline at every breakpoint — as a
  // reason block scrolls into its "active" band, the statistic counts up,
  // the description fades in, and the accent line grows; scrolling past it
  // plays the same timeline in reverse, so the previous reason fades away
  // exactly as the next one takes over. Only the reveal's travel distance
  // scales down per tier (100% desktop / 90% tablet / 80% mobile) — the
  // mechanism (counter, line-grow, reversible trigger) is identical
  // everywhere.
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
        const blocks = blockRefs.current.filter(Boolean);
        if (!blocks.length) return undefined;

        const revealDistance = isDesktop ? 16 : isTablet ? 14 : 12;

        const scrollTriggers = blocks.map((block, index) => {
          const stat = STATS[index];
          const statEl = block.querySelector("[data-stat]");
          const revealEl = block.querySelector("[data-reveal]");
          const lineEl = block.querySelector("[data-line]");

          if (statEl) statEl.textContent = formatStatValue(0, stat);

          const counter = { value: 0 };

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: block,
              start: "top 65%",
              end: "bottom 35%",
              toggleActions: "play reverse play reverse",
            },
          });

          timeline
            .fromTo(lineEl, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power2.out" }, 0)
            .fromTo(
              revealEl,
              { opacity: 0, y: revealDistance },
              { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
              0.05
            )
            .fromTo(
              counter,
              { value: 0 },
              {
                value: stat.value,
                duration: 1,
                ease: "power2.out",
                onUpdate: () => {
                  if (statEl) statEl.textContent = formatStatValue(counter.value, stat);
                },
              },
              0
            );

          return timeline.scrollTrigger;
        });

        return () => scrollTriggers.forEach((trigger) => trigger?.kill());
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="why-choose-us"
      aria-label="Why Choose Us"
      className="section bg-background"
    >
      <Container maxWidth="content">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left — sticky heading + intro, stays in view while the right column progresses. */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <SectionHeading
              eyebrow="WHY CHOOSE US"
              title="Built on Expertise, Delivered with Precision"
              description="Luhan Earth Movers delivers foundation and ground engineering solutions built on technical expertise, advanced equipment, quality execution, and a commitment to safety across every project."
              align="left"
            />
          </div>

          {/* Right — one reason at a time, each a normally-flowing block. */}
          <div className="flex flex-col gap-16 md:gap-24 lg:gap-32">
            {STATS.map((stat, index) => (
              <article
                key={stat.id}
                ref={(el) => {
                  blockRefs.current[index] = el;
                }}
                className="flex min-h-[45vh] flex-col justify-center py-6 md:min-h-[50vh] lg:min-h-[55vh]"
              >
                <GlassCard
                  radius="2xl"
                  padding="lg"
                  className="relative overflow-hidden"
                >
                  <GridBackground />
                  <NoiseOverlay />
                  <div className="relative z-20">
                    <span data-stat className="text-hero block text-primary">
                      {formatStatValue(stat.value, stat)}
                    </span>

                    <div data-reveal>
                      <h3 className="text-h3 mt-4 text-text">{stat.label}</h3>
                      <p className="text-body-lg mt-3 text-text-muted">
                        {REASON_DESCRIPTIONS[stat.id]}
                      </p>
                    </div>

                    <div
                      data-line
                      aria-hidden="true"
                      className="mt-6 h-1 w-24 origin-left rounded-full bg-primary"
                    />
                  </div>
                </GlassCard>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
