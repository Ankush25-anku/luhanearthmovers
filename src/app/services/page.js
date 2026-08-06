import InnerHero from "@/components/common/InnerHero";
import Services from "@/sections/Services/Services";

export const metadata = {
  title: "Services | Luhan Earth Movers",
  description:
    "Foundation engineering, ground engineering, and testing & investigation services from Luhan Earth Movers — every stage of ground and foundation engineering.",
};

export default function ServicesPage() {
  return (
    <main>
      <InnerHero
        title="Services"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        image="/assets/images/projects/foundation-engineering.webp"
      />
      <Services />
    </main>
  );
}
