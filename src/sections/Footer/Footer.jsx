"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUp, Clock, Mail, MapPin, Phone } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

import Container from "@/components/common/Container";
import GridBackground from "@/components/common/GridBackground";
import NoiseOverlay from "@/components/common/NoiseOverlay";
import Button from "@/components/common/Button";

import { COMPANY } from "@/data/company";
import { MAIN_NAV } from "@/data/navigation";
import { FOOTER_COLUMNS, FOOTER_BOTTOM } from "@/data/footer";

import { fadeUp } from "@/animations/gsap/reveal";

const SERVICES_COLUMN = FOOTER_COLUMNS.find(
  (column) => column.title === "Services",
);
const LEGAL_COLUMN = FOOTER_COLUMNS.find((column) => column.title === "Legal");

const SOCIAL_LINKS = [
  {
    key: "linkedin",
    href: COMPANY.social.linkedin,
    label: "LinkedIn",
    Icon: FaLinkedinIn,
  },
  {
    key: "instagram",
    href: COMPANY.social.instagram,
    label: "Instagram",
    Icon: FaInstagram,
  },
  {
    key: "facebook",
    href: COMPANY.social.facebook,
    label: "Facebook",
    Icon: FaFacebookF,
  },
  {
    key: "youtube",
    href: COMPANY.social.youtube,
    label: "YouTube",
    Icon: FaYoutube,
  },
].filter((social) => Boolean(social.href));
const ADDRESS_LINE = [
  COMPANY.contact.address.line1,
  COMPANY.contact.address.line2,
  `${COMPANY.contact.address.city}, ${COMPANY.contact.address.state} ${COMPANY.contact.address.pincode}`,
].join(", ");

function FooterHeading({ children }) {
  return <p className="text-caption text-text-muted">{children}</p>;
}

function scrollToTop() {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Footer() {
  const columnsRef = useRef(null);
  const bottomBarRef = useRef(null);

  // Very subtle, one-shot fade — no pinning, no elaborate choreography.
  useEffect(() => {
    const tweens = [
      fadeUp(columnsRef.current, { y: 20, duration: 0.8, start: "top 95%" }),
      fadeUp(bottomBarRef.current, {
        y: 12,
        duration: 0.6,
        delay: 0.15,
        start: "top 98%",
      }),
    ].filter(Boolean);

    return () => {
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    };
  }, []);

  return (
    <footer className="relative overflow-hidden bg-background-secondary">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <GridBackground className="opacity-40" fade={false} />
        <NoiseOverlay />
        <div className="absolute inset-x-0 top-0 h-px bg-primary/10" />
        <div className="absolute left-10 top-0 h-3 w-px bg-primary/30" />
        <div className="absolute right-10 top-0 h-3 w-px bg-primary/30" />
      </div>

      <Container maxWidth="content" className="relative py-20 lg:py-24">
        <div
          ref={columnsRef}
          className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8"
        >
          {/* 1. Company */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-3"
              aria-label={`${COMPANY.name} — Home`}
            >
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent font-number text-xl text-background"
              >
                {COMPANY.shortName.charAt(0)}
              </span>
              <span className="font-heading text-base font-semibold text-text">
                {COMPANY.name}
              </span>
            </Link>

            <p className="text-body mt-5 max-w-xs text-text-muted">
              {COMPANY.description}
            </p>
          </div>

          {/* 2. Navigation */}
          <nav aria-label="Footer navigation">
            <FooterHeading>Navigation</FooterHeading>
            <ul className="mt-5 flex flex-col gap-3">
              {MAIN_NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body text-text-muted hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 3. Services */}
          {SERVICES_COLUMN ? (
            <nav aria-label="Footer services">
              <FooterHeading>{SERVICES_COLUMN.title}</FooterHeading>
              <ul className="mt-5 flex flex-col gap-3">
                {SERVICES_COLUMN.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body text-text-muted hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          {/* 4. Contact */}
          <div>
            <FooterHeading>Contact</FooterHeading>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <a
                  href={`tel:${COMPANY.contact.phone.replace(/\s+/g, "")}`}
                  className="flex items-start gap-2.5 text-body text-text-muted hover:text-primary"
                >
                  <Phone
                    className="mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  {COMPANY.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY.contact.email}`}
                  className="flex items-start gap-2.5 text-body text-text-muted hover:text-primary"
                >
                  <Mail
                    className="mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  {COMPANY.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-body text-text-muted">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                <span>{ADDRESS_LINE}</span>
              </li>
              <li className="flex items-start gap-2.5 text-body text-text-muted">
                <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{COMPANY.contact.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          ref={bottomBarRef}
          className="mt-16 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex flex-col gap-2 text-center md:text-left">
            <p className="text-caption text-text-muted">
              {FOOTER_BOTTOM.copyright}
            </p>
            {LEGAL_COLUMN ? (
              <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 md:justify-start">
                {LEGAL_COLUMN.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-caption text-text-muted hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="flex items-center justify-center gap-6 md:justify-end">
            {SOCIAL_LINKS.length > 0 ? (
              <ul className="flex items-center gap-4">
                {SOCIAL_LINKS.map(({ key, href, label, Icon }) => (
                  <li key={key}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-muted transition-colors duration-300 hover:border-primary hover:text-primary"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}

            <Button
              type="button"
              onClick={scrollToTop}
              variant="ghost"
              size="sm"
              leftIcon={<ArrowUp aria-hidden="true" />}
            >
              Back to Top
            </Button>
          </div>
        </div>
      </Container>
    </footer>
  );
}
