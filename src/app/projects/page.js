import InnerHero from "@/components/common/InnerHero";
import Projects from "@/sections/Projects/Projects";

export const metadata = {
  title: "Projects | Luhan Earth Movers",
  description:
    "A selection of foundation and ground engineering works across Bangalore, built on precise investigation, calibrated equipment, and rigorous quality control.",
};

export default function ProjectsPage() {
  return (
    <main>
      <InnerHero
        title="Projects"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
        image="/assets/images/projects/hebbal-metro-corridor.webp"
      />
      <Projects />
    </main>
  );
}
