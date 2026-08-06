"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";

import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import GlassCard from "@/components/common/GlassCard";
import Button from "@/components/common/Button";
import GridBackground from "@/components/common/GridBackground";
import NoiseOverlay from "@/components/common/NoiseOverlay";

import { COMPANY } from "@/data/company";
import { fadeUp } from "@/animations/gsap/reveal";

const ADDRESS_LINES = [
  COMPANY.contact.address.line1,
  COMPANY.contact.address.line2,
  `${COMPANY.contact.address.city}, ${COMPANY.contact.address.state} ${COMPANY.contact.address.pincode}`,
  COMPANY.contact.address.country,
];

const INFO_ITEMS = [
  {
    key: "address",
    Icon: MapPin,
    label: "Site Office",
    content: ADDRESS_LINES.join(", "),
  },
  {
    key: "phone",
    Icon: Phone,
    label: "Phone",
    content: COMPANY.contact.phoneDisplay,
    href: `tel:${COMPANY.contact.phone.replace(/\s+/g, "")}`,
  },
  {
    key: "email",
    Icon: Mail,
    label: "Email",
    content: COMPANY.contact.email,
    href: `mailto:${COMPANY.contact.email}`,
  },
  {
    key: "hours",
    Icon: Clock,
    label: "Working Hours",
    content: COMPANY.contact.workingHours,
  },
];

const INITIAL_FORM = { name: "", email: "", phone: "", message: "" };

function ContactForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState("idle"); // idle | submitting | submitted

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus("submitting");

    window.setTimeout(() => {
      setStatus("submitted");
      setForm(INITIAL_FORM);
    }, 900);
  };

  return (
    <GlassCard radius="2xl" padding="lg" className="relative overflow-hidden">
      <GridBackground className="opacity-40" />
      <NoiseOverlay />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex flex-col gap-5"
        aria-label="Contact form"
      >
        <h3 className="text-h3 text-text">Send Us a Message</h3>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-caption text-text-muted">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="h-12 rounded-lg border border-border bg-background-secondary px-4 text-body text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-caption text-text-muted">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 00000 00000"
              className="h-12 rounded-lg border border-border bg-background-secondary px-4 text-body text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-caption text-text-muted">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="h-12 rounded-lg border border-border bg-background-secondary px-4 text-body text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="text-caption text-text-muted">
            Project Details
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            value={form.message}
            onChange={handleChange}
            placeholder="Tell us about your site, scope, and timeline…"
            className="resize-none rounded-lg border border-border bg-background-secondary px-4 py-3 text-body text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={status === "submitting"}
          rightIcon={<Send aria-hidden="true" />}
          className="mt-2 self-start"
        >
          {status === "submitted" ? "Message Sent" : "Send Message"}
        </Button>

        <p
          role="status"
          aria-live="polite"
          className={`text-caption text-primary transition-opacity duration-300 ${
            status === "submitted" ? "opacity-100" : "opacity-0"
          }`}
        >
          Thanks — we&apos;ll get back to you within one business day.
        </p>
      </form>
    </GlassCard>
  );
}

export default function Contact() {
  const gridRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const tweens = [
      fadeUp(gridRef.current, { y: 32, duration: 0.9, start: "top 85%" }),
      fadeUp(mapRef.current, { y: 32, duration: 0.9, start: "top 90%" }),
    ].filter(Boolean);

    return () => {
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    };
  }, []);

  return (
    <section
      id="contact"
      aria-label={`Contact ${COMPANY.name}`}
      className="section bg-background"
    >
      <Container maxWidth="content">
        <SectionHeading
          eyebrow="GET IN TOUCH"
          title="Let's Build Something Solid"
          description="Reach out with your site details and scope — our engineering team will get back to you with a clear, no-obligation assessment."
          align="center"
        />

        <div
          ref={gridRef}
          className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12"
        >
          {/* Company info column */}
          <div className="flex flex-col gap-4">
            {INFO_ITEMS.map(({ key, Icon, label, content, href }) => {
              const Wrapper = href ? "a" : "div";
              return (
                <GlassCard key={key} radius="xl" padding="md">
                  <Wrapper
                    {...(href ? { href } : {})}
                    className="flex items-start gap-4"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="text-caption block text-text-muted">
                        {label}
                      </span>
                      <span className="text-body mt-1 block text-text">
                        {content}
                      </span>
                    </span>
                  </Wrapper>
                </GlassCard>
              );
            })}
          </div>

          {/* Contact form column */}
          <ContactForm />
        </div>

        {/* Map placeholder */}
        <div ref={mapRef} className="mt-8">
          <GlassCard
            radius="2xl"
            padding="lg"
            className="relative flex min-h-[22rem] items-center justify-center overflow-hidden"
          >
            <GridBackground />
            <NoiseOverlay />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 -right-16 z-10 h-64 w-64 rounded-full bg-primary/25 blur-3xl"
            />

            <div className="relative z-20 flex flex-col items-center gap-4 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
                <MapPin className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-h3 text-text">Find Us on the Map</p>
                <p className="text-body mt-2 max-w-md text-text-muted">
                  {ADDRESS_LINES.join(", ")}
                </p>
              </div>
              <Button
                href={COMPANY.contact.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="md"
              >
                Open in Google Maps
              </Button>
            </div>
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}
