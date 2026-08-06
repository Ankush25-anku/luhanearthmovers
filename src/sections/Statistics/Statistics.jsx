"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import GlassCard from "@/components/common/GlassCard";
import GridBackground from "@/components/common/GridBackground";
import NoiseOverlay from "@/components/common/NoiseOverlay";

import { STATS } from "@/data/stats";
import { pinSectionWithTimeline } from "@/animations/gsap/pinSection";
import { animateCounter } from "@/animations/gsap/counters";

// The panel sequence requested for this section, resolved against the real
// data layer — no stat content is hardcoded, only the display order.
const PANEL_ORDER = ["projects-completed", "years-experience", "piles-installed", "safety-compliance"];
const PANEL_STATS = PANEL_ORDER.map((id) => STATS.find((stat) => stat.id === id)).filter(Boolean);

// Navbar's own unscrolled height (src/components/navigation/Navbar.jsx: h-24) —
// the pin must start below it so a panel is never partially hidden underneath.
const DEFAULT_NAVBAR_HEIGHT = 96;

function measureNavbarHeight() {
  if (typeof document === "undefined") return DEFAULT_NAVBAR_HEIGHT;
  const header = document.querySelector("header");
  return header?.offsetHeight || DEFAULT_NAVBAR_HEIGHT;
}

/** Starts the current panel's rich choreography: counter, text, rotation, glow, grid. */
function activatePanel(panel, stat, cleanupRef) {
  if (!panel) return;

  const numberEl = panel.querySelector("[data-number]");
  const textEl = panel.querySelector("[data-text]");
  const circleEl = panel.querySelector("[data-circle]");
  const glowEl = panel.querySelector("[data-glow]");
  const atmosphereEl = panel.querySelector("[data-atmosphere]");

  const tweens = [];

  tweens.push(
    animateCounter(numberEl, {
      from: 0,
      to: stat.value,
      prefix: stat.prefix ?? "",
      suffix: stat.suffix ?? "",
      duration: 1.4,
      ease: "power2.out",
      scrollTrigger: false,
    })
  );

  tweens.push(
    gsap.fromTo(
      textEl,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power2.out" }
    )
  );

  if (circleEl) {
    gsap.set(circleEl, { rotate: 0 });
    tweens.push(gsap.to(circleEl, { rotate: 360, duration: 26, repeat: -1, ease: "none" }));
  }

  if (glowEl) {
    tweens.push(
      gsap.to(glowEl, { opacity: 0.75, scale: 1.15, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" })
    );
  }

  if (atmosphereEl) {
    tweens.push(gsap.to(atmosphereEl, { opacity: 1, duration: 0.8, ease: "power2.out" }));
  }

  cleanupRef.current = tweens.filter(Boolean);
}

/** Stops and resets whatever `activatePanel` started. */
function deactivatePanel(panel, cleanupRef) {
  cleanupRef.current?.forEach((tween) => tween.kill());
  cleanupRef.current = null;
  if (!panel) return;

  gsap.set(panel.querySelector("[data-text]"), { opacity: 0 });
  gsap.set(panel.querySelector("[data-glow]"), { opacity: 0, scale: 1 });
  gsap.set(panel.querySelector("[data-atmosphere]"), { opacity: 0.25 });
}

/** One fullscreen statistic panel — number, label, rotating ring, ambient glow. */
function StatPanel({ stat, index, panelRef }) {
  return (
    <div
      ref={panelRef}
      style={{ zIndex: index + 1 }}
      className="absolute inset-0 flex h-full flex-col items-center justify-center overflow-hidden text-center"
    >
      <div
        data-atmosphere
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25"
      >
        <GridBackground />
        <NoiseOverlay />
        <div
          data-glow
          className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40 opacity-0 blur-3xl"
        />
      </div>

      <div
        data-circle
        aria-hidden="true"
        className="pointer-events-none absolute h-[16rem] w-[16rem] rounded-full border border-primary/25 md:h-[22rem] md:w-[22rem] lg:h-[30rem] lg:w-[30rem]"
      />

      <div className="relative z-20 px-6">
        <span
          data-number
          className="block font-number leading-none text-text"
          style={{ fontSize: "clamp(3.5rem, 14vw, 13rem)" }}
        >
          {(stat.prefix ?? "") + stat.value.toLocaleString() + (stat.suffix ?? "")}
        </span>

        <p data-text className="text-h3 mt-6 text-primary">
          {stat.label}
        </p>
      </div>

      <GlassCard
        radius="full"
        padding="sm"
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 px-6 py-2 md:bottom-10"
      >
        <span className="text-caption text-text-muted">
          {String(index + 1).padStart(2, "0")} / {String(PANEL_STATS.length).padStart(2, "0")}
        </span>
      </GlassCard>
    </div>
  );
}

export default function Statistics() {
  const pinTargetRef = useRef(null);
  const panelRefs = useRef([]);

  // Same pinned, cinematic single-panel choreography at every breakpoint —
  // each incoming panel slides up while the previous fades away completely,
  // and whichever panel is current gets its own real-time choreography
  // (counter, rotating ring, pulsing glow, grid brightening) started/
  // stopped as it becomes active/inactive. Only the pin distance scales
  // down per tier (100% desktop / 90% tablet / 80% mobile).
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
        const panels = panelRefs.current.filter(Boolean);
        if (!panels.length) return undefined;

        const navbarOffset = measureNavbarHeight();
        pinTargetRef.current?.style.setProperty("--navbar-offset", `${navbarOffset}px`);
        const distanceRatio = isDesktop ? 1 : isTablet ? 0.9 : 0.8;
        const distancePerPanel = window.innerHeight * distanceRatio;
        // Desktop keeps its original scrub value exactly; lighter on
        // tablet/mobile — same panel-swap effect, less recompute per frame.
        const scrubAmount = isDesktop ? 1 : isTablet ? 0.7 : 0.5;

        panels.forEach((panel, index) => {
          gsap.set(panel, { yPercent: index === 0 ? 0 : 100, opacity: 1, zIndex: index + 1 });
        });

        const activeCleanupRef = { current: null };
        let activeIndex = -1;

        const setActive = (index) => {
          if (index === activeIndex) return;
          if (activeIndex !== -1) deactivatePanel(panels[activeIndex], activeCleanupRef);
          activeIndex = index;
          activatePanel(panels[index], PANEL_STATS[index], activeCleanupRef);
        };

        // The active panel's choreography (rotating ring, pulsing glow) is
        // an infinite `repeat: -1` tween — without pausing it, it keeps
        // running at full cost forever after the user scrolls past this
        // pinned section (onUpdate simply stops firing, it never "ends").
        // onLeave/onLeaveBack pause it exactly when the section leaves the
        // viewport; onEnter/onEnterBack resume it, mirroring an
        // IntersectionObserver's enter/exit without a second observer
        // duplicating what this ScrollTrigger already tracks.
        const pauseActive = () => {
          if (activeIndex === -1) return;
          deactivatePanel(panels[activeIndex], activeCleanupRef);
          activeIndex = -1;
        };

        const result = pinSectionWithTimeline(
          pinTargetRef.current,
          (timeline) => {
            panels.forEach((panel, index) => {
              if (index === 0) return;
              const outgoing = panels[index - 1];
              timeline
                .to(outgoing, { opacity: 0, duration: 1, ease: "none" }, index - 1)
                .to(panel, { yPercent: 0, duration: 1, ease: "none" }, index - 1);
            });
          },
          {
            start: () => `top top+=${navbarOffset}`,
            end: () => `+=${distancePerPanel * (panels.length - 1)}`,
            scrub: scrubAmount,
            onUpdate: (self) => {
              const idx = Math.min(panels.length - 1, Math.floor(self.progress * panels.length));
              setActive(idx);
            },
            onEnter: () => setActive(0),
            onEnterBack: () => setActive(panels.length - 1),
            onLeave: pauseActive,
            onLeaveBack: pauseActive,
          }
        );

        // Covers the (uncommon) case where the page loads already scrolled
        // to this section — every other case is handled by onEnter/onEnterBack above.
        if (result?.scrollTrigger?.isActive) {
          setActive(0);
        }

        return () => {
          result?.scrollTrigger?.kill();
          activeCleanupRef.current?.forEach((tween) => tween.kill());
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section id="statistics" aria-label="Our Impact in Numbers" className="relative bg-background">
      <div
        ref={pinTargetRef}
        style={{ "--navbar-offset": `${DEFAULT_NAVBAR_HEIGHT}px` }}
        className="relative h-[calc(100vh-var(--navbar-offset))] overflow-hidden"
      >
        {PANEL_STATS.map((stat, index) => (
          <StatPanel
            key={stat.id}
            stat={stat}
            index={index}
            panelRef={(el) => {
              panelRefs.current[index] = el;
            }}
          />
        ))}
      </div>
    </section>
  );
}
