import HeroCanvas from "./HeroCanvas";
import HeroOverlay from "./HeroOverlay";
import HeroParticles from "./HeroParticles";
// import HeroContent from "./HeroContent";

/**
 * Hero
 * Pure composition — no animation lives here. The section is exactly one
 * viewport tall; HeroCanvas pins it via ScrollTrigger and scrubs its frame
 * sequence across that pin. ScrollTrigger's own pin is the ONLY thing that
 * makes this viewport-locked — every layer below is `absolute inset-0`
 * (sized to this `relative h-dvh` section), not independently `fixed`,
 * so once the pin releases they scroll away naturally with the section
 * instead of staying glued to the viewport over every section after it.
 */
export default function Hero() {
  return (
    <section id="home" className="relative h-dvh overflow-hidden">
      <HeroCanvas />
      <HeroOverlay />
      <HeroParticles />
      {/* <HeroContent /> */}
    </section>
  );
}
