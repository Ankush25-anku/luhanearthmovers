"use client";

import Hero from "@/sections/Hero/Hero";
import Process from "@/sections/Process/Process";
import WhyChooseUs from "@/sections/WhyChooseUs/WhyChooseUs";
import Statistics from "@/sections/Statistics/Statistics";
import Testimonials from "@/sections/Testimonials/Testimonials";
import CTA from "@/sections/CTA/CTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <Process />
      <WhyChooseUs />
      <Statistics />
      <Testimonials />
      <CTA />
    </main>
  );
}
