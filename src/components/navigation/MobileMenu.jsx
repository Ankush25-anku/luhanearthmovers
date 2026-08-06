"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";

import GridBackground from "@/components/common/GridBackground";
import NoiseOverlay from "@/components/common/NoiseOverlay";
import Button from "@/components/common/Button";

const EASE_PREMIUM = [0.16, 1, 0.3, 1];
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled])';

// Drawer slides in from the right (Framer's equivalent of GSAP's
// xPercent: 100 → 0) with a slight blur-in resolving to sharp, on a smooth
// cubic-bezier — combined, this is the "premium" open/close motion.
const panelVariants = {
  hidden: { x: "100%", filter: "blur(8px)" },
  visible: {
    x: "0%",
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: EASE_PREMIUM },
  },
  exit: {
    x: "100%",
    filter: "blur(6px)",
    transition: { duration: 0.45, ease: EASE_PREMIUM },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: EASE_PREMIUM } },
  exit: { opacity: 0, transition: { duration: 0.35, ease: EASE_PREMIUM, delay: 0.1 } },
};

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_PREMIUM } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.25, ease: EASE_PREMIUM } },
};

const ctaVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_PREMIUM, delay: 0.15 } },
  exit: { opacity: 0, y: 12, transition: { duration: 0.2, ease: EASE_PREMIUM } },
};

/**
 * MobileMenu
 * Premium fullscreen navigation drawer for < lg. Structure only — the
 * open/close mechanics (isOpen/onClose/links props, AnimatePresence,
 * body-scroll lock, Escape/outside-click) are unchanged; this pass fixes
 * the visual: true 100dvh/100vw coverage, a top logo/close row, vertically
 * centered links with real breathing room, a bottom CTA, safe-area
 * padding, and a focus trap so Tab never escapes the menu while it's open.
 *
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {{label: string, href: string}[]} links
 */
export default function MobileMenu({ isOpen, onClose, links }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const panel = panelRef.current;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimeout = setTimeout(() => {
      panel?.querySelector(FOCUSABLE_SELECTOR)?.focus();
    }, 50);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const focusable = Array.from(panel.querySelectorAll(FOCUSABLE_SELECTOR));
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(focusTimeout);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 z-[var(--z-modal)] h-dvh w-screen overflow-hidden lg:hidden"
        >
          <motion.div
            ref={panelRef}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(event) => event.stopPropagation()}
            className="relative flex h-full w-full flex-col overflow-hidden bg-background/97 backdrop-blur-2xl"
          >
            {/* Atmosphere — grid, noise, dark gradient, orange glow. Same language as the rest of the site. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <GridBackground className="opacity-20" />
              <NoiseOverlay />
              <div className="absolute inset-0 bg-gradient-to-b from-background-secondary/60 via-transparent to-background" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]" />
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl md:h-96 md:w-96" />
            </div>

            <div className="relative z-10 flex h-full w-full flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
              {/* Top — logo left, close button right */}
              <div className="flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8">
                <Link
                  href="/"
                  onClick={onClose}
                  aria-label="Lohani Earth Movers — Home"
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="relative h-9 w-24 md:h-10 md:w-28">
                    <Image
                      src="/assets/images/lohani-logo.png"
                      alt="Lohani Earth Movers"
                      fill
                      sizes="120px"
                      className="object-contain object-left"
                    />
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-text transition-colors duration-300 ease-premium hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Middle — nav links, vertically centered */}
              <motion.ul
                variants={listVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-1 flex-col items-center justify-center gap-6 overflow-y-auto px-6 py-8 md:gap-8"
              >
                {links.map((link) => (
                  <motion.li key={link.href} variants={itemVariants}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="font-heading text-3xl font-semibold text-text transition-colors duration-300 ease-premium hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background md:text-4xl"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Bottom — CTA */}
              <motion.div
                variants={ctaVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex justify-center px-6 pb-8 md:pb-10"
              >
                {/* Button's href variant renders a next/link and doesn't forward
                    onClick (only its plain-<button> branch does) — this wrapper
                    catches the click via bubbling so the menu still closes. */}
                <div onClick={onClose}>
                  <Button href="/contact" variant="primary" size="sm">
                    Get Free Consultation
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
