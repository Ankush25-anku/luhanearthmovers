"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import gsap from "gsap";
import Image from "next/image";

import MobileMenu from "./MobileMenu";

// Scroll distance (px) after which the navbar morphs into its glass state.
const SCROLL_THRESHOLD = 80;

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  // Reserved for the upcoming mobile drawer — no drawer is rendered yet.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const headerRef = useRef(null);
  const brandRef = useRef(null);
  const ctaRef = useRef(null);
  const linkRefs = useRef([]);
  const tickingRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (tickingRef.current) return;
    tickingRef.current = true;

    window.requestAnimationFrame(() => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
      tickingRef.current = false;
    });
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // One-shot cinematic entrance on mount. GSAP is not used for the scroll
  // morph below — that's a simple two-state transition, handled by CSS.
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        headerRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
      )
        .fromTo(
          brandRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.55",
        )
        .fromTo(
          linkRefs.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.06 },
          "-=0.5",
        )
        .fromTo(
          ctaRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.4",
        );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const setLinkRef = (index) => (el) => {
    linkRefs.current[index] = el;
  };

  return (
    <header
      ref={headerRef}
      className={[
        "fixed inset-x-0 top-0 z-[var(--z-header)] w-full",
        "transition-[background-color,backdrop-filter,border-color,box-shadow,height] duration-[var(--duration-base)] ease-premium",
        isScrolled
          ? "h-19 border-b border-border bg-background-secondary/75 shadow-lg backdrop-blur-glass"
          : "h-24 border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-full max-w-[var(--max-w-page)] items-center justify-between px-6 md:px-10 lg:px-14"
      >
        {/* Logo + Company Name */}
        {/* Company Logo */}
        {/* Company Logo */}
        <Link
          ref={brandRef}
          href="/"
          aria-label="Lohani Earth Movers Home"
          className={[
            "flex items-center h-full overflow-hidden transition-transform duration-[var(--duration-base)] ease-premium",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            isScrolled ? "scale-90" : "scale-100",
          ].join(" ")}
        >
          {/*
            Logo box: flex + items-center (no fixed height) so the logo is
            always vertically centered by the parent nav's own flex
            alignment, never fights the header's scrolled/unscrolled
            height, and can never overflow it. flex-shrink-0 keeps it from
            being squeezed if the link list ever gets tight.
          */}
          <div className="flex flex-shrink-0 items-center">
            {/*
              Real source is 1600×1200 (4:3) — width/height here just
              establish that intrinsic ratio for Next/Image; the rendered
              size is controlled entirely by the height/width-auto classes
              below, per tier:
                mobile  (<768px):  35–45px
                tablet  (768–1023px): 45–55px
                desktop (≥1024px): 55–65px
              object-contain (never cover) preserves the ratio exactly —
              no stretching, no cropping. max-w caps it so a much wider
              logo file swapped in later couldn't blow out the layout.
            */}
            <Image
              src="/assets/images/lohani-logo.png"
              alt="Lohani Earth Movers"
              width={1600}
              height={1200}
              priority
              sizes="(max-width: 767px) 60px, (max-width: 1023px) 73px, 87px"
              className="h-[clamp(35px,28px+2.24vw,45px)] w-auto max-w-[180px] object-contain md:h-[clamp(45px,15px+3.9vw,55px)] lg:h-[clamp(55px,30px+2.4vw,65px)]"
            />
          </div>
        </Link>

        {/* Center Menu — desktop only */}
        <ul className="hidden items-center gap-12 lg:flex">
          {NAV_LINKS.map((link, index) => (
            <li key={link.href}>
              <Link
                ref={setLinkRef(index)}
                href={link.href}
                className="link-underline group relative inline-flex py-2 font-body text-sm font-medium text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="inline-block transition-[color,transform,letter-spacing] duration-300 ease-premium group-hover:-translate-y-0.5 group-hover:tracking-[var(--tracking-wide)] group-hover:text-primary">
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side — CTA (desktop) + Hamburger (mobile/tablet) */}
        <div className="flex items-center gap-4">
          <Link
            ref={ctaRef}
            href="/contact"
            className="glow-orange-hover group hidden items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3.5 font-body text-sm font-semibold text-background transition-transform duration-300 ease-premium hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:inline-flex"
          >
            Get Free Consultation
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 ease-premium group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>

          {/* Hamburger — mobile/tablet only. Opens the fullscreen MobileMenu. */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-full text-text transition-colors duration-300 ease-premium hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:hidden"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        links={NAV_LINKS}
      />
    </header>
  );
}
