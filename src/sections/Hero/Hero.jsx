import HeroCanvas from "./HeroCanvas";
import HeroOverlay from "./HeroOverlay";
import HeroParticles from "./HeroParticles";
// import HeroContent from "./HeroContent";

/**
 * Hero
 * Pure composition — no animation lives here. The section itself is a
 * single viewport tall; HeroCanvas pins it via ScrollTrigger and its own
 * `end: "+=350%"` supplies ALL of the extra scroll distance for the frame
 * scrub (ScrollTrigger's pin-spacer reserves that space automatically —
 * giving the section its own large explicit height on top of that, e.g.
 * h-[500vh], double-reserves scroll room and leaves a dead blank gap
 * after the pin releases and before About appears). Every layer below is
 * fixed to the viewport so it stays put alongside the canvas for the
 * whole pin, rather than scrolling away inside the section.
 */
export default function Hero() {
  return (
    <section className="relative h-screen">
      <div className="fixed inset-0 h-screen w-screen overflow-hidden">
        <HeroCanvas />
        <HeroOverlay />
        <HeroParticles />
        {/* <HeroContent /> */}
      </div>
    </section>
  );
}