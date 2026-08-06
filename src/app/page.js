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
      <Hero />
      <About />
      <Services />
      <Projects />
      <Process />
      <WhyChooseUs />
      <Statistics />
      <Gallery />
      <Testimonials />
      <CTA />
    </main>
  );
}
