/**
 * Services
 * Structured hierarchy: categories → services → { description, image, slug }.
 * `image` paths are placeholders for future Next.js Image assets.
 */

export const SERVICE_CATEGORIES = [
  {
    slug: "foundation-engineering",
    title: "Foundation Engineering",
    shortDescription:
      "Luhan Earth Movers provides advanced foundation engineering solutions in Bangalore, delivering reliable piling systems designed for residential, commercial, and infrastructure projects with precision and safety.",
    image: "/assets/images/projects/foundation-engineering.webp",
    services: [
      {
        slug: "rotary-piling",
        name: "Rotary Piling Services",
        description:
          "High-capacity rotary bored piling solutions for deep foundations, executed using modern equipment and engineered techniques for challenging ground conditions.",
        image: "/images/services/rotary-piling.jpg",
      },
      {
        slug: "micropiling",
        name: "Micropiling Contractors",
        description:
          "Specialized micropiling solutions for restricted-access sites, strengthening existing structures and providing reliable foundation support.",
        image: "/images/services/micropiling.jpg",
      },
      {
        slug: "auger-piling",
        name: "Auger Piling Contractors",
        description:
          "Efficient auger piling solutions offering fast installation with reduced vibration, suitable for urban construction environments.",
        image: "/images/services/auger-piling.jpg",
      },
    ],
  },

  {
    slug: "ground-engineering",
    title: "Ground Engineering",
    shortDescription:
      "Luhan Earth Movers delivers complete ground engineering solutions including soil improvement, stabilization, and excavation support systems to ensure long-term structural stability.",
    image: "/assets/images/projects/ground-engineering.webp",
    services: [
      {
        slug: "soil-nailing",
        name: "Soil Nailing Contractors",
        description:
          "Professional soil nailing solutions for slope stabilization, excavation protection, and improved ground strength.",
        image: "/images/services/soil-nailing.jpg",
      },
      {
        slug: "soil-anchoring",
        name: "Soil Anchoring Contractors",
        description:
          "Ground anchoring solutions designed to provide additional stability for retaining structures and deep excavations.",
        image: "/images/services/soil-anchoring.jpg",
      },
      {
        slug: "shotcreting",
        name: "Shotcreting Contractors",
        description:
          "Shotcrete applications for slope protection, excavation support, and durable ground reinforcement.",
        image: "/images/services/shotcreting.jpg",
      },
    ],
  },

  {
    slug: "testing-investigation",
    title: "Testing & Investigation",
    shortDescription:
      "Luhan Earth Movers provides geotechnical testing and investigation services to ensure every foundation meets safety, performance, and engineering requirements.",
    image: "/assets/images/projects/testing-investigation.webp",
    services: [
      {
        slug: "geotechnical-investigation",
        name: "Geotechnical Services",
        description:
          "Complete geotechnical investigation services including soil analysis, site assessment, and engineering recommendations.",
        image: "/images/services/geotechnical-investigation.jpg",
      },
      {
        slug: "load-testing",
        name: "Load Testing Services",
        description:
          "Reliable foundation load testing services to verify pile capacity and structural performance.",
        image: "/images/services/load-testing.jpg",
      },
      {
        slug: "pile-testing",
        name: "Pile Testing",
        description:
          "Advanced pile testing services including integrity and capacity testing for quality assurance.",
        image: "/images/services/pile-testing.jpg",
      },
    ],
  },
];

/** Flat lookup of every individual service across all categories, keyed by slug. */
export const SERVICES_BY_SLUG = SERVICE_CATEGORIES.reduce((acc, category) => {
  category.services.forEach((service) => {
    acc[service.slug] = {
      ...service,
      categorySlug: category.slug,
      categoryTitle: category.title,
    };
  });
  return acc;
}, {});
