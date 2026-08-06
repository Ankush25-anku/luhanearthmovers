"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Button from "@/components/common/Button";
import GlassCard from "@/components/common/GlassCard";
import GridBackground from "@/components/common/GridBackground";
import NoiseOverlay from "@/components/common/NoiseOverlay";

import { COMPANY } from "@/data/company";
import { fadeInUp } from "@/animations/motion/fade";
import { floatSlow, floatSubtle } from "@/animations/motion/floating";
import { hoverLiftCard } from "@/animations/motion/hover";

export default function About() {
  const prefersReducedMotion = useReducedMotion();

  const gridMotionProps = prefersReducedMotion
    ? {}
    : {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.25 },
        variants: fadeInUp,
      };

  const imageMotionProps = prefersReducedMotion
    ? {}
    : { ...floatSlow, ...hoverLiftCard };
  const statMotionProps = prefersReducedMotion ? {} : floatSubtle;

  return (
    <section
      id="about"
      aria-label={`About ${COMPANY.name}`}
      className="section bg-background"
    >
      <Container maxWidth="content">
        <motion.div
          {...gridMotionProps}
          className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24"
        >
          {/* Left — image placeholder with an overlapping, independently-floating stat */}
          <div className="relative mb-16 lg:mb-0">
            <motion.div {...imageMotionProps}>
              <GlassCard
                radius="2xl"
                padding="lg"
                className="relative aspect-[4/5] w-full overflow-hidden"
              >
                <GridBackground />
                <NoiseOverlay />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-16 -right-16 z-10 h-64 w-64 rounded-full bg-primary/30 blur-3xl"
                />

                {/* Placeholder content — swap for a Next.js Image (fill) later,
                    the aspect-ratio + overflow-hidden wrapper above stays as-is. */}
                <div className="relative z-20 h-full w-full">
                  <Image
                    src="/assets/images/about-foundation.webp"
                    alt="VNS Prime Infra foundation engineering work"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              {...statMotionProps}
              className="absolute -bottom-8 left-6 md:left-10"
            >
              <GlassCard
                radius="xl"
                padding="md"
                className="relative overflow-hidden shadow-elevated"
              >
                <GridBackground fade={false} className="opacity-60" />
                <NoiseOverlay />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-10 -left-10 z-10 h-40 w-40 rounded-full bg-primary/35 blur-3xl"
                />

                <div className="relative z-20">
                  <span className="text-number block text-[clamp(3rem,2rem+5vw,5rem)] leading-[0.9] text-primary">
                    {COMPANY.yearsOfExperience}+
                  </span>
                  <span className="text-caption mt-2 block max-w-[10rem] text-text-muted">
                    Years of {COMPANY.tagline}
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Right — heading, copy, CTA */}
          <div>
            <SectionHeading
              eyebrow={`About ${COMPANY.name}`.toUpperCase()}
              title={
                <>
                  <span className="block">Building Strong Foundations</span>
                  <span className="block">Across Bangalore</span>
                </>
              }
              description={COMPANY.description}
              align="left"
            />

            <Button
              href="/about"
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight aria-hidden="true" />}
              className="mt-10"
            >
              Explore Our Expertise
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
