"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ClipboardCheck,
  Compass,
  FileCheck2,
  HardHat,
  Search,
  Truck,
} from "lucide-react";

import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import GlassCard from "@/components/common/GlassCard";
import Button from "@/components/common/Button";
import GridBackground from "@/components/common/GridBackground";
import NoiseOverlay from "@/components/common/NoiseOverlay";

import { PROCESS_STEPS } from "@/data/process";
import { fadeUp } from "@/animations/gsap/reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Maps the string icon names stored in the data layer to real components.
const ICONS = { Search, Compass, Truck, HardHat, ClipboardCheck, FileCheck2 };

const ACTIVE_NODE_CLASSES = ["border-primary", "bg-primary", "text-background"];
const INACTIVE_NODE_CLASSES = ["border-border", "bg-background-secondary", "text-text-muted"];

/** Toggles one row between its resting and "active milestone" state. */
function setRowActive(row, active) {
  if (!row) return;
  const node = row.querySelector("[data-node]");
  const card = row.querySelector("[data-card]");
  const particles = row.querySelectorAll("[data-particle]");

  if (node) {
    node.classList.remove(...(active ? INACTIVE_NODE_CLASSES : ACTIVE_NODE_CLASSES));
    node.classList.add(...(active ? ACTIVE_NODE_CLASSES : INACTIVE_NODE_CLASSES));
    gsap.to(node, {
      boxShadow: active ? "0 0 28px rgba(249,115,22,0.55)" : "0 0 0px rgba(249,115,22,0)",
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });
  }

  particles.forEach((particle) => {
    particle.classList.toggle("opacity-100", active);
    particle.classList.toggle("opacity-0", !active);
  });

  if (card) {
    gsap.to(card, {
      scale: active ? 1.02 : 1,
      opacity: active ? 1 : 0.85,
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto",
    });
  }
}

function setActiveRow(rows, index) {
  rows.forEach((row, i) => setRowActive(row, i === index));
}

/** One milestone — node (icon + step number) and its alternating-side card. */
function ProcessRow({ step, index, rowRef }) {
  const Icon = ICONS[step.icon] ?? Search;
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={rowRef}
      className="relative grid grid-cols-[3.5rem_1fr] items-start gap-6 md:grid-cols-[1fr_4rem_1fr] md:items-center md:gap-0"
    >
      <div
        data-node
        className="relative z-10 mx-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-border bg-background-secondary text-text-muted transition-colors duration-300 md:col-start-2"
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
        <span
          data-particle
          aria-hidden="true"
          className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-primary opacity-0 transition-opacity duration-300"
        />
        <span
          data-particle
          aria-hidden="true"
          className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent opacity-0 transition-opacity duration-300"
        />
      </div>

      <div
        data-card
        className={[
          "opacity-0",
          isLeft ? "md:col-start-1 md:pr-8 lg:pr-14" : "md:col-start-3 md:pl-8 lg:pl-14",
        ].join(" ")}
      >
        <GlassCard radius="lg" padding="md" className="w-full text-left">
          <span className="text-caption text-primary">{step.step}</span>
          <h3 className="text-h3 mt-2 text-text">{step.title}</h3>
          <p className="text-body mt-3 text-text-muted">{step.description}</p>
          <Button
            href="/contact"
            variant="ghost"
            size="sm"
            rightIcon={<ArrowRight aria-hidden="true" />}
            className="mt-4"
          >
            Learn More
          </Button>
        </GlassCard>
      </div>
    </div>
  );
}

export default function Process() {
  const sectionRef = useRef(null);
  const atmosphereRef = useRef(null);
  const headingRef = useRef(null);
  const lineRef = useRef(null);
  const rowRefs = useRef([]);

  useEffect(() => {
    // Entrance choreography — identical at every breakpoint: the blueprint
    // atmosphere fades in and the heading reveals as the section arrives.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        atmosphereRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      fadeUp(headingRef.current, { y: 24, duration: 0.9, start: "top 85%" });
    }, sectionRef);

    // Same choreography at every breakpoint: the connecting line draws with
    // scroll, each card slides in from its side, particles drift near it,
    // and whichever milestone is centered in the viewport becomes the
    // single "active" one — its node glows, its particles surface, and it
    // scales up slightly while every other card dims. Only the slide
    // distance scales down per tier (100% desktop / 90% tablet / 80%
    // mobile) — the mechanism itself is identical everywhere.
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        isTablet: "(min-width: 768px) and (max-width: 1023px)",
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        const { isDesktop, isTablet } = context.conditions;
        const rows = rowRefs.current.filter(Boolean);
        if (!rows.length) return undefined;

        const slideDistance = isDesktop ? 48 : isTablet ? 43 : 38;
        // Desktop keeps its original scrub value exactly; lighter on
        // tablet/mobile — same line-draw effect, less recompute per frame.
        const lineScrub = isDesktop ? 1 : isTablet ? 0.7 : 0.5;

        gsap.set(lineRef.current, { scaleY: 0 });
        gsap.to(lineRef.current, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 60%",
            scrub: lineScrub,
          },
        });

        rows.forEach((row, index) => {
          const card = row.querySelector("[data-card]");
          if (!card) return;

          const isLeft = index % 2 === 0;

          gsap.fromTo(
            card,
            { opacity: 0, x: isLeft ? -slideDistance : slideDistance },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: row,
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            }
          );

          row.querySelectorAll("[data-particle]").forEach((particle, pi) => {
            gsap.to(particle, {
              y: pi % 2 === 0 ? -4 : 4,
              duration: 1.6 + pi * 0.3,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          });

          ScrollTrigger.create({
            trigger: row,
            start: "top 60%",
            end: "bottom 40%",
            onToggle: (self) => {
              if (self.isActive) setActiveRow(rows, index);
            },
          });
        });

        return () => {
          rows.forEach((row) => setRowActive(row, false));
        };
      }
    );

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section id="process" aria-label="Our Process" className="section relative bg-background">
      <div
        ref={atmosphereRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <GridBackground className="opacity-70" />
        <NoiseOverlay />
        <div className="absolute inset-x-0 top-24 h-px bg-primary/10" />
        <div className="absolute inset-x-0 bottom-24 h-px bg-primary/10" />
        <div className="absolute left-8 top-24 h-3 w-px bg-primary/30" />
        <div className="absolute right-8 bottom-24 h-3 w-px bg-primary/30" />
      </div>

      <div ref={headingRef}>
        <Container maxWidth="content">
          <SectionHeading
            eyebrow="OUR PROCESS"
            title="Building Excellence Step by Step"
            align="center"
          />
        </Container>
      </div>

      <Container maxWidth="content" className="relative mt-20 lg:mt-28">
        <div className="relative mx-auto max-w-3xl">
          <div
            aria-hidden="true"
            className="absolute left-7 top-0 h-full w-px bg-border md:left-1/2 md:-translate-x-1/2"
          />
          <div
            ref={lineRef}
            aria-hidden="true"
            className="absolute left-7 top-0 h-full w-px origin-top scale-y-0 bg-primary md:left-1/2 md:-translate-x-1/2"
          />

          <div className="relative flex flex-col gap-10 md:gap-10 lg:gap-16">
            {PROCESS_STEPS.map((step, index) => (
              <ProcessRow
                key={step.id}
                step={step}
                index={index}
                rowRef={(el) => {
                  rowRefs.current[index] = el;
                }}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
