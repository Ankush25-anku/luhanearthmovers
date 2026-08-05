import GridBackground from "@/components/common/GridBackground";
import NoiseOverlay from "@/components/common/NoiseOverlay";

/**
 * HeroOverlay
 * Purely decorative atmosphere sitting on top of the Hero frame sequence —
 * gradients, grid, glow, and grain. No text, no interaction, no JS beyond
 * plain React/Tailwind (no GSAP, no Framer Motion).
 */
export default function HeroOverlay() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 3. Blueprint engineering grid — very subtle, ~10% opacity */}
      <GridBackground className="opacity-10" fade={false} />

      {/* 5. Orange radial glow — bottom-right, large, very soft */}
      <div
        className="absolute -bottom-1/4 -right-1/4 h-[26rem] w-[26rem] rounded-full bg-primary/20 blur-3xl md:h-[40rem] md:w-[40rem] lg:h-[56rem] lg:w-[56rem]"
      />

      {/* 1. Top dark gradient — keeps the white Navbar legible over the frames */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-background/85 via-background/25 to-transparent" />

      {/* 2. Bottom gradient — blends the Hero into the About section beneath it */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/40 to-transparent" />

      {/* 6. Vignette — darkens the screen edges/corners */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />

      {/* 4. Noise texture — same procedural grain as NoiseOverlay, given a
          very slow, subtle opacity breathe via a built-in Tailwind keyframe
          (no custom CSS/GSAP/Framer Motion needed). */}
      <div className="absolute inset-0 animate-[pulse_9s_ease-in-out_infinite]">
        <NoiseOverlay opacity={0.045} />
      </div>
    </div>
  );
}
