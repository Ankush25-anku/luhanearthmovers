"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import GridBackground from "@/components/common/GridBackground";
import NoiseOverlay from "@/components/common/NoiseOverlay";

import { fadeUp } from "@/animations/gsap/reveal";
import { getMagneticOffset, getMagneticRest, createMagneticTransition } from "@/animations/motion/magnetic";

const HEADING_LINES = ["READY", "TO BUILD", "THE NEXT", "LANDMARK?"];
const LIFT_AMOUNT = 8;

/**
 * Magnetic, soft-lifting wrapper around the primary CTA. Button itself
 * stays untouched/static — this motion tree is entirely separate from the
 * GSAP-driven heading/background reveal below, so nothing fights over the
 * same element's transform.
 */
function MagneticCta() {
  const wrapperRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    if (!wrapperRef.current) return;
    const magnetic = getMagneticOffset(event, wrapperRef.current, { strength: 0.35, maxOffset: 18 });
    setOffset({ x: magnetic.x, y: magnetic.y - LIFT_AMOUNT });
  };

  const handleMouseLeave = () => {
    setOffset(getMagneticRest());
  };

  return (
    <motion.div
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={createMagneticTransition({ stiffness: 180, damping: 14, mass: 0.4 })}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="inline-block"
    >
      <Button
        href="/contact"
        variant="primary"
        size="lg"
        rightIcon={<ArrowRight aria-hidden="true" />}
      >
        Get a Free Consultation
      </Button>
    </motion.div>
  );
}

export default function CTA() {
  const atmosphereRef = useRef(null);
  const lineRefs = useRef([]);
  const textRef = useRef(null);

  // Single scroll-triggered entrance, reusing `fadeUp` for every piece
  // (atmosphere, heading lines, supporting text) rather than hand-rolling
  // three separate tweens — only the `y` distance differs per call.
  useEffect(() => {
    const tweens = [
      fadeUp(atmosphereRef.current, { y: 0, duration: 1.4, start: "top 85%" }),
      fadeUp(lineRefs.current.filter(Boolean), {
        y: 60,
        duration: 0.9,
        stagger: 0.12,
        start: "top 80%",
      }),
      fadeUp(textRef.current, { y: 24, duration: 0.8, delay: 0.4, start: "top 80%" }),
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
      id="cta"
      aria-label="Get a Free Consultation"
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-background py-24 md:min-h-screen"
    >
      <div
        ref={atmosphereRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0"
      >
        <GridBackground />
        <NoiseOverlay />
        <div className="absolute left-1/2 top-1/2 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-3xl" />

        {/* Technical guide lines */}
        <div className="absolute inset-x-0 top-16 h-px bg-primary/10" />
        <div className="absolute inset-x-0 bottom-16 h-px bg-primary/10" />
        <div className="absolute left-10 top-16 h-3 w-px bg-primary/30" />
        <div className="absolute right-10 bottom-16 h-3 w-px bg-primary/30" />
      </div>

      <Container maxWidth="content" className="relative z-10 text-center">
        <h2 className="text-hero leading-[0.95] text-text">
          {HEADING_LINES.map((line, index) => (
            <span
              key={line}
              ref={(el) => {
                lineRefs.current[index] = el;
              }}
              className="block"
            >
              {line}
            </span>
          ))}
        </h2>

        <p ref={textRef} className="text-body-lg mx-auto mt-8 max-w-xl text-text-muted">
          Let&apos;s talk about your site, your soil, and your schedule — and build the
          foundation that makes the rest of the project possible.
        </p>

        <div className="mt-12 flex justify-center">
          <MagneticCta />
        </div>
      </Container>
    </section>
  );
}
