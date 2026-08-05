"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import GlassCard from "@/components/common/GlassCard";
import GridBackground from "@/components/common/GridBackground";
import NoiseOverlay from "@/components/common/NoiseOverlay";

import { TESTIMONIALS } from "@/data/testimonials";
import { fadeUp } from "@/animations/gsap/reveal";
import { EASE_PREMIUM } from "@/animations/motion/fade";

// Cycled per card — different padding (size), vertical offset, and rotation
// (±2° max) so the wall reads as naturally scattered, not a grid. Tablet
// gets a lighter alternating offset only; mobile gets none of this.
const SCATTER = [
  { padding: "lg", lg: "lg:translate-y-6 lg:-rotate-2" },
  { padding: "md", lg: "lg:-translate-y-4 lg:rotate-1" },
  { padding: "md", lg: "lg:translate-y-10 lg:rotate-2" },
  { padding: "lg", lg: "lg:-translate-y-8 lg:-rotate-1" },
  { padding: "sm", lg: "lg:translate-y-2 lg:rotate-1" },
];

// Fixed, decorative positions — presentational only, not "content".
const PARTICLES = [
  { top: "12%", left: "8%", delay: "0s" },
  { top: "28%", left: "88%", delay: "0.6s" },
  { top: "55%", left: "18%", delay: "1.1s" },
  { top: "70%", left: "76%", delay: "0.3s" },
  { top: "85%", left: "40%", delay: "0.9s" },
  { top: "40%", left: "55%", delay: "1.4s" },
];

const liftVariants = {
  rest: { y: 0, scale: 1 },
  hover: { y: -10, scale: 1.02, transition: { duration: 0.4, ease: EASE_PREMIUM } },
};
const glassBoostVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.3, ease: EASE_PREMIUM } },
};
const glowVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.4, ease: EASE_PREMIUM } },
};
const quoteIconVariants = {
  rest: { rotate: 0 },
  hover: { rotate: -10, transition: { duration: 0.35, ease: EASE_PREMIUM } },
};

/**
 * One floating card. GSAP owns the outer wrapper's scroll-reveal
 * (opacity/y, set up in the parent effect); the hover choreography lives
 * entirely on the nested Framer Motion tree, so the two never fight over
 * the same element's transform.
 */
function TestimonialCard({ testimonial, tabletOffset, scatter, itemRef }) {
  return (
    <div
      ref={itemRef}
      className={`opacity-0 ${tabletOffset} ${scatter.lg}`}
    >
      <motion.div initial="rest" whileHover="hover" variants={liftVariants}>
        <GlassCard radius="2xl" padding={scatter.padding} className="relative overflow-hidden">
          {/* Faux "glass intensifies" wash — GlassCard's own blur is fixed,
              so hover layers a soft light wash on top instead. */}
          <motion.div
            variants={glassBoostVariants}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 bg-white/[0.04]"
          />
          <motion.div
            variants={glowVariants}
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-12 -right-12 z-0 h-48 w-48 rounded-full bg-primary/35 blur-3xl"
          />

          <div className="relative z-20">
            <motion.div variants={quoteIconVariants} className="inline-flex">
              <Quote className="h-8 w-8 text-primary/70" aria-hidden="true" />
            </motion.div>

            <p className="text-body-lg mt-4 text-text">{testimonial.quote}</p>

            <div className="mt-6 flex items-center gap-1" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={
                    i < testimonial.rating
                      ? "h-4 w-4 fill-primary text-primary"
                      : "h-4 w-4 text-border"
                  }
                />
              ))}
            </div>
            <span className="sr-only">{testimonial.rating} out of 5 stars</span>

            <footer className="mt-4">
              <p className="text-body font-semibold text-text">{testimonial.author}</p>
              <p className="text-caption mt-1 text-text-muted">
                {testimonial.role} · {testimonial.company}
              </p>
            </footer>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

export default function Testimonials() {
  const itemRefs = useRef([]);

  // Scroll reveal only — no pinning. Cards alternate their entrance
  // direction (rising from below vs. dropping from above), reusing the
  // shared `fadeUp` helper for both groups rather than hand-rolled tweens.
  useEffect(() => {
    const items = itemRefs.current.filter(Boolean);
    if (!items.length) return undefined;

    const rising = items.filter((_, index) => index % 2 === 0);
    const falling = items.filter((_, index) => index % 2 === 1);

    const tweens = [
      fadeUp(rising, { y: 48, duration: 0.8, stagger: 0.18, start: "top 88%" }),
      fadeUp(falling, { y: -48, duration: 0.8, stagger: 0.18, delay: 0.09, start: "top 88%" }),
    ].filter(Boolean);

    return () => {
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    };
  }, []);

  return (
    <section id="testimonials" aria-label="Client Testimonials" className="section relative bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <GridBackground className="opacity-60" />
        <NoiseOverlay />
        {PARTICLES.map((particle, index) => (
          <span
            key={index}
            className="absolute h-1 w-1 animate-pulse rounded-full bg-primary/40"
            style={{ top: particle.top, left: particle.left, animationDelay: particle.delay }}
          />
        ))}
      </div>

      <Container maxWidth="content" className="relative">
        <SectionHeading
          eyebrow="TESTIMONIALS"
          title="What Our Clients Say"
          description="Foundations are trust exercises — here's what the developers, contractors, and site teams we've worked alongside have to say about it."
          align="center"
        />

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:mt-28 lg:grid-cols-3 lg:items-start lg:gap-10">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              scatter={SCATTER[index % SCATTER.length]}
              tabletOffset={index % 2 === 1 ? "md:mt-10 lg:mt-0" : ""}
              itemRef={(el) => {
                itemRefs.current[index] = el;
              }}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
