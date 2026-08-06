"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import GlassCard from "@/components/common/GlassCard";
import Button from "@/components/common/Button";
import GridBackground from "@/components/common/GridBackground";
import NoiseOverlay from "@/components/common/NoiseOverlay";

import { FEATURED_PROJECTS } from "@/data/projects";
import { SERVICES_BY_SLUG } from "@/data/services";
import { horizontalScroll } from "@/animations/gsap/horizontalScroll";

// Navbar's own unscrolled height (src/components/navigation/Navbar.jsx: h-24) —
// the pin must start below it so a card is never partially hidden underneath.
const DEFAULT_NAVBAR_HEIGHT = 96;

function measureNavbarHeight() {
  if (typeof document === "undefined") return DEFAULT_NAVBAR_HEIGHT;
  const header = document.querySelector("header");
  return header?.offsetHeight || DEFAULT_NAVBAR_HEIGHT;
}

/** One project — media placeholder + details. Fully data-driven. */
function ProjectCard({ project }) {
  const serviceNames = project.scope
    .map((slug) => SERVICES_BY_SLUG[slug]?.name)
    .filter(Boolean);

  return (
  <article className="project-card w-[85vw] shrink-0 px-2 md:w-[65vw] md:px-3 lg:w-[85vw] lg:px-4">
      <GlassCard
        radius="2xl"
        padding="lg"
        className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl lg:aspect-auto lg:h-full lg:min-h-[24rem]">
          <GridBackground />
          <NoiseOverlay />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -right-16 z-10 h-64 w-64 rounded-full bg-primary/25 blur-3xl"
          />
          <div className="relative z-20 h-full w-full">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div>
          <p className="text-caption text-primary">
            {project.location} · {project.year}
          </p>

          <h3 className="text-h2 mt-3 text-text">{project.title}</h3>

          <p className="text-body-lg mt-4 text-text-muted">
            {project.description}
          </p>

          {serviceNames.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {serviceNames.map((name) => (
                <li
                  key={name}
                  className="text-caption rounded-full border border-border px-3 py-1 text-text-muted"
                >
                  {name}
                </li>
              ))}
            </ul>
          )}

          <Button
            href={`/projects/${project.slug}`}
            variant="outline"
            size="md"
            rightIcon={<ArrowRight aria-hidden="true" />}
            className="mt-8"
          >
            View Project
          </Button>
        </div>
      </GlassCard>
    </article>
  );
}

export default function Projects() {
  const pinTargetRef = useRef(null);

  // Same pin + horizontal-scroll mechanism at every breakpoint — the track
  // translates horizontally as the user scrolls vertically. Card width
  // (85vw desktop / 65vw tablet / 85vw mobile) already scales the natural
  // scroll distance per tier since it's viewport-relative; on top of that,
  // an explicit scrub tuning keeps tablet/mobile feeling responsive rather
  // than laggy. The pin itself is never disabled at any width.
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
        const navbarOffset = measureNavbarHeight();
        const scrubAmount = isDesktop ? 1 : isTablet ? 0.8 : 0.6;

        const tween = horizontalScroll(pinTargetRef.current, {
          start: () => `top top+=${navbarOffset}`,
          scrub: scrubAmount,
        });

        return () => tween?.scrollTrigger?.kill();
      }
    );

    return () => mm.revert();
  }, []);
  return (
    <section
      id="projects"
      aria-label="Featured Projects"
      className="section bg-background"
    >
      <Container maxWidth="content">
        <SectionHeading
          eyebrow="FEATURED PROJECTS"
          title="Engineering Excellence in Action"
          description="A selection of foundation and ground engineering works across Bangalore — each one built on precise investigation, calibrated equipment, and rigorous quality control."
          align="center"
        />
      </Container>

      <div ref={pinTargetRef} className="relative mt-16 overflow-hidden">
        <div className="flex flex-row gap-4 md:gap-6 lg:gap-10">
          {FEATURED_PROJECTS.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
