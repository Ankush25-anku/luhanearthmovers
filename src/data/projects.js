/**
 * Projects
 * Portfolio entries used by the Projects/Gallery sections.
 */

export const PROJECT_SECTORS = [
  { slug: "commercial", label: "Commercial" },
  { slug: "residential", label: "Residential" },
  { slug: "industrial", label: "Industrial" },
  { slug: "infrastructure", label: "Infrastructure" },
];

export const PROJECTS = [
  {
    slug: "whitefield-business-park",
    title: "Whitefield Business Park",
    sector: "commercial",
    location: "Whitefield, Bengaluru",
    year: 2023,
    description:
      "Deep foundation and rotary piling works executed by Luhan Earth Movers for a commercial development, ensuring strong structural support through precision engineering and advanced piling techniques.",
    scope: ["rotary-piling", "load-testing", "geotechnical-investigation"],
    stats: [
      { label: "Piles Installed", value: "412" },
      { label: "Max Depth", value: "28m" },
    ],
    image: "/assets/images/projects/whitefield-business-park.webp",
    featured: true,
  },

  {
    slug: "electronic-city-tech-campus",
    title: "Electronic City Tech Campus",
    sector: "commercial",
    location: "Electronic City, Bengaluru",
    year: 2022,
    description:
      "Foundation engineering solutions delivered for a large technology campus, including specialized piling systems designed for Bangalore's challenging soil conditions.",
    scope: ["under-reamed-piles", "plate-load-testing"],
    stats: [
      { label: "Piles Installed", value: "586" },
      { label: "Site Area", value: "8.2 acres" },
    ],
    image: "/assets/images/projects/electronic-city-tech-campus.webp",
    featured: true,
  },

  {
    slug: "sarjapur-hillview-residences",
    title: "Sarjapur Hillview Residences",
    sector: "residential",
    location: "Sarjapur Road, Bengaluru",
    year: 2023,
    description:
      "Micropiling and ground improvement solutions provided for a residential development, delivering reliable foundation stability across challenging terrain.",
    scope: ["micropiling", "soil-stabilization", "geotechnical-investigation"],
    stats: [
      { label: "Units Supported", value: "320" },
      { label: "Slope Gradient", value: "1:4" },
    ],
    image: "/assets/images/projects/sarjapur-hillview-residences.webp",
    featured: true,
  },

  {
    slug: "hebbal-metro-corridor-retaining-works",
    title: "Hebbal Metro Corridor Retaining Works",
    sector: "infrastructure",
    location: "Hebbal, Bengaluru",
    year: 2021,
    description:
      "Ground engineering and excavation support works including soil nailing and shotcreting solutions for infrastructure development projects.",
    scope: ["soil-nailing", "shotcreting", "soil-anchoring"],
    stats: [
      { label: "Wall Length", value: "640m" },
      { label: "Excavation Depth", value: "12m" },
    ],
    image: "/assets/images/projects/hebbal-metro-corridor.webp",
    featured: false,
  },

  {
    slug: "bannerghatta-logistics-park",
    title: "Bannerghatta Logistics Park",
    sector: "industrial",
    location: "Bannerghatta Road, Bengaluru",
    year: 2020,
    description:
      "Industrial foundation works completed with auger piling and pile testing solutions to support heavy-load infrastructure requirements.",
    scope: ["auger-piling", "pile-testing"],
    stats: [
      { label: "Warehouse Area", value: "260,000 sq.ft" },
      { label: "Piles Installed", value: "298" },
    ],
    image: "/assets/images/projects/bannerghatta-logistics-park.webp",
    featured: false,
  },

  {
    slug: "devanahalli-aerospace-park",
    title: "Devanahalli Aerospace Park",
    sector: "industrial",
    location: "Devanahalli, Bengaluru",
    year: 2024,
    description:
      "Comprehensive geotechnical investigation and rotary piling services delivered for a precision industrial facility requiring high-performance foundation solutions.",
    scope: ["geotechnical-investigation", "rotary-piling", "load-testing"],
    stats: [
      { label: "Boreholes Logged", value: "36" },
      { label: "Piles Installed", value: "475" },
    ],
    image: "/assets/images/projects/devanahalli-aerospace-park.webp",
    featured: true,
  },
];

/** Featured subset, for homepage highlight grids. */
export const FEATURED_PROJECTS = PROJECTS.filter((project) => project.featured);