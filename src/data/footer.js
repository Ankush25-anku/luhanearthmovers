/**
 * Footer
 * Structured content for the site footer — link columns, newsletter copy,
 * and the bottom legal row. Keeps footer copy editable in one place,
 * separate from the general site navigation in src/data/navigation.js.
 */

export const FOOTER_COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Projects", href: "/projects" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      {
        label: "Foundation Engineering",
        href: "/services/foundation-engineering",
      },
      { label: "Ground Engineering", href: "/services/ground-engineering" },
      {
        label: "Testing & Investigation",
        href: "/services/testing-investigation",
      },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
];

export const FOOTER_NEWSLETTER = {
  title: "Stay Updated",
  description:
    "Project updates and industry insights from Luhan Earth Movers, delivered occasionally — no spam.",
  placeholder: "Enter your email",
  ctaLabel: "Subscribe",
};

export const FOOTER_BOTTOM = {
  copyright: `© ${new Date().getFullYear()} Luhan Earth Movers. All rights reserved.`,
  credit: "Engineered & executed with precision.",
};
