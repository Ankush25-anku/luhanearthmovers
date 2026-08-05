"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import GlassCard from "@/components/common/GlassCard";
import GridBackground from "@/components/common/GridBackground";
import NoiseOverlay from "@/components/common/NoiseOverlay";
import Button from "@/components/common/Button";
import Image from "next/image";

import { PROJECTS } from "@/data/projects";
import { fadeUp } from "@/animations/gsap/reveal";
import { EASE_PREMIUM } from "@/animations/motion/fade";

// Cycled per card so the masonry columns never line up into uniform rows.
const ASPECT_VARIANTS = [
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-[5/4]",
  "aspect-[4/3]",
];

const liftVariants = {
  rest: { y: 0 },
  hover: { y: -8, transition: { duration: 0.35, ease: EASE_PREMIUM } },
};
const imageVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.08, transition: { duration: 0.5, ease: EASE_PREMIUM } },
};
const glowVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.4, ease: EASE_PREMIUM } },
};
const overlayVariants = {
  rest: { opacity: 0, y: 12 },
  hover: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_PREMIUM },
  },
};

/**
 * One showcase tile. GSAP owns the outer `<article>`'s scroll-reveal
 * (opacity/y, set up in the parent effect) — the hover choreography lives
 * entirely on the nested Framer Motion tree below it, so the two never
 * fight over the same element's transform.
 */
function GalleryCard({ project, aspect, itemRef }) {
  return (
    <article
      ref={itemRef}
      className="mb-6 break-inside-avoid opacity-0 lg:mb-8"
    >
      <motion.div initial="rest" whileHover="hover" variants={liftVariants}>
        <GlassCard
          radius="2xl"
          padding="sm"
          className={`relative w-full overflow-hidden ${aspect}`}
        >
          <motion.div variants={imageVariants} className="absolute inset-0">
            <GridBackground />
            <NoiseOverlay />
            <div className="relative z-20 h-full w-full">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            variants={glowVariants}
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 -right-10 z-10 h-56 w-56 rounded-full bg-primary/35 blur-3xl"
          />

          <motion.div
            variants={overlayVariants}
            className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-background via-background/80 to-transparent p-6"
          >
            <h3 className="text-h3 text-text">{project.title}</h3>
            <p className="text-caption mt-1 flex items-center gap-1.5 text-text-muted">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {project.location}
            </p>
            <Button
              href={`/projects/${project.slug}`}
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight aria-hidden="true" />}
              className="mt-3"
            >
              View Project
            </Button>
          </motion.div>
        </GlassCard>
      </motion.div>
    </article>
  );
}

export default function Gallery() {
  const itemRefs = useRef([]);

  // Scroll reveal only — no pinning. Cards alternate their entrance
  // direction (rising from below vs. dropping from above) by splitting the
  // set into two groups, each staggered via the shared `fadeUp` helper.
  useEffect(() => {
    const items = itemRefs.current.filter(Boolean);
    if (!items.length) return undefined;

    const rising = items.filter((_, index) => index % 2 === 0);
    const falling = items.filter((_, index) => index % 2 === 1);

    const tweens = [
      fadeUp(rising, { y: 48, duration: 0.8, stagger: 0.15, start: "top 88%" }),
      fadeUp(falling, {
        y: -48,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.08,
        start: "top 88%",
      }),
    ].filter(Boolean);

    return () => {
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    };
  }, []);

  return (
    <section
      id="gallery"
      aria-label="Construction Showcase"
      className="section bg-background"
    >
      <Container maxWidth="content">
        <SectionHeading
          eyebrow="OUR WORK"
          title="A Showcase Built on Site"
          description="Every project on this wall started as a set of boreholes and a soil report — here's the range of ground we've engineered across Bangalore."
          align="center"
        />

        <div className="mt-16 columns-1 gap-6 md:columns-2 lg:columns-3 lg:gap-8">
          {PROJECTS.map((project, index) => (
            <GalleryCard
              key={project.slug}
              project={project}
              aspect={ASPECT_VARIANTS[index % ASPECT_VARIANTS.length]}
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
