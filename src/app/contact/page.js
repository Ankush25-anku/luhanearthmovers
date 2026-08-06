import InnerHero from "@/components/common/InnerHero";
import Contact from "@/sections/Contact/Contact";

export const metadata = {
  title: "Contact | Luhan Earth Movers",
  description:
    "Get in touch with Luhan Earth Movers for foundation and ground engineering projects across Bangalore.",
};

export default function ContactPage() {
  return (
    <main>
      <InnerHero
        title="Contact"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        image="/assets/images/projects/ground-engineering.webp"
      />
      <Contact />
    </main>
  );
}
