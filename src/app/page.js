"use client";

import Hero from "@/sections/Hero/Hero";
import About from "@/sections/About/About";
import Services from "@/sections/Services/Services";
import Projects from "@/sections/Projects/Projects";
import Process from "@/sections/Process/Process";
import WhyChooseUs from "@/sections/WhyChooseUs/WhyChooseUs";
import Statistics from "@/sections/Statistics/Statistics";
import Gallery from "@/sections/Gallery/Gallery";
import Testimonials from "@/sections/Testimonials/Testimonials";
import CTA from "@/sections/CTA/CTA";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section id="home">
        <Hero />
      </section>

      {/* About */}
      <section id="about">
        <About />
      </section>

      {/* Services */}
      <section id="services">
        <Services />
      </section>

      {/* Projects */}
      <section id="projects">
        <Projects />
      </section>

      {/* Process */}
      <section id="process">
        <Process />
      </section>

      {/* Why Choose Us */}
      <section id="why-choose-us">
        <WhyChooseUs />
      </section>

      {/* Statistics */}
      <section id="statistics">
        <Statistics />
      </section>

      {/* Gallery */}
      <section id="gallery">
        <Gallery />
      </section>

      {/* Testimonials */}
      <section id="testimonials">
        <Testimonials />
      </section>

      {/* Contact / CTA */}
      <section id="contact">
        <CTA />
      </section>
    </main>
  );
}
