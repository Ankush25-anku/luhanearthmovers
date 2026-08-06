import InnerHero from "@/components/common/InnerHero";
import About from "@/sections/About/About";

export const metadata = {
  title: "About Us | Luhan Earth Movers",
  description:
    "Luhan Earth Movers is a specialist foundation and ground engineering company serving Bangalore's construction industry.",
};

export default function AboutPage() {
  return (
    <main>
      <InnerHero
        title="About"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        image="/assets/images/about-foundation.webp"
      />
      <About />
    </main>
  );
}
