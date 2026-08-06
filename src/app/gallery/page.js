import InnerHero from "@/components/common/InnerHero";
import Gallery from "@/sections/Gallery/Gallery";

export const metadata = {
  title: "Gallery | Luhan Earth Movers",
  description:
    "A showcase of foundation and ground engineering work from Luhan Earth Movers across Bangalore.",
};

export default function GalleryPage() {
  return (
    <main>
      <InnerHero
        title="Gallery"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
        image="/assets/images/projects/whitefield-business-park.webp"
      />
      <Gallery />
    </main>
  );
}
