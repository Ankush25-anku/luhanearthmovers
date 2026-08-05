"use client";

import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 70;
const MAX_DELTA = 0.05; // clamp dt (seconds) so a backgrounded tab can't jump particles

// Three subtle atmosphere types — sizes/speeds/colors tuned so none of them
// read as sparks or fire, just quiet drifting dust/soil/haze.
const PARTICLE_TYPES = [
  { type: "dust", weight: 0.5, size: [1, 2.2], speed: [8, 18], opacity: [0.15, 0.35], color: "250,250,250", blur: 0 },
  { type: "soil", weight: 0.3, size: [1.5, 3.2], speed: [6, 14], opacity: [0.18, 0.4], color: "184,142,99", blur: 0 },
  { type: "haze", weight: 0.2, size: [22, 46], speed: [3, 8], opacity: [0.02, 0.06], color: "250,250,250", blur: 6 },
];

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function pickType() {
  const roll = Math.random();
  let cumulative = 0;
  for (const config of PARTICLE_TYPES) {
    cumulative += config.weight;
    if (roll <= cumulative) return config;
  }
  return PARTICLE_TYPES[0];
}

/** (Re)randomizes a particle in place — used both at creation and on respawn. */
function resetParticle(particle, width, height) {
  const config = pickType();
  particle.config = config;
  particle.baseX = randomBetween(0, width);
  particle.y = height + randomBetween(0, height * 0.3);
  particle.size = randomBetween(...config.size);
  particle.baseOpacity = randomBetween(...config.opacity);
  particle.speed = randomBetween(...config.speed);
  particle.drift = randomBetween(-4, 4);
  particle.wobbleSpeed = randomBetween(0.3, 0.8);
  particle.wobbleAmount = randomBetween(4, 14);
  particle.wobbleOffset = Math.random() * Math.PI * 2;
  particle.life = 0;
  particle.lifetime = randomBetween(9, 20);
  return particle;
}

/** Smooth 0→1→0 fade envelope so lifetime-based respawns never "pop". */
function getLifeFactor(life, lifetime) {
  const t = life / lifetime;
  const fadeIn = Math.min(1, t / 0.15);
  const fadeOut = Math.min(1, (1 - t) / 0.15);
  return Math.max(0, Math.min(fadeIn, fadeOut));
}

export default function HeroParticles() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(0);
  const sizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      sizeRef.current = { width, height };

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();

    // Seed particles once; every future "spawn" just reuses the same array
    // in place via resetParticle — no per-frame allocation.
    if (!particlesRef.current.length) {
      const { width, height } = sizeRef.current;
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => {
        const particle = resetParticle({}, width, height);
        // Scatter initial life across the full range so particles don't
        // all fade in/out in sync on first paint.
        particle.life = Math.random() * particle.lifetime;
        particle.y = randomBetween(0, height);
        return particle;
      });
    }

    const tick = (now) => {
      const dt = Math.min(MAX_DELTA, (now - lastTimeRef.current) / 1000 || 0);
      lastTimeRef.current = now;

      const { width, height } = sizeRef.current;
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((particle) => {
        particle.life += dt;
        particle.baseX += particle.drift * dt;
        particle.y -= particle.speed * dt;

        if (particle.life >= particle.lifetime || particle.y < -particle.size * 2) {
          resetParticle(particle, width, height);
          return;
        }

        const renderX =
          particle.baseX +
          Math.sin(particle.life * particle.wobbleSpeed + particle.wobbleOffset) * particle.wobbleAmount;
        const opacity = particle.baseOpacity * getLifeFactor(particle.life, particle.lifetime);
        if (opacity <= 0) return;

        ctx.globalAlpha = opacity;
        ctx.filter = particle.config.blur ? `blur(${particle.config.blur}px)` : "none";
        ctx.fillStyle = `rgb(${particle.config.color})`;
        ctx.beginPath();
        ctx.arc(renderX, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      ctx.filter = "none";

      rafRef.current = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (rafRef.current) return;
      lastTimeRef.current = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      if (!rafRef.current) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };

    startLoop();

    let resizeFrame = null;
    const handleResize = () => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(resizeCanvas);
    };
    window.addEventListener("resize", handleResize);

    // Pause entirely once the Hero scrolls out of view — the biggest
    // single win for "very low CPU usage" on a long page.
    const observedSection = canvas.closest("section") ?? canvas.parentElement;
    let observer = null;
    if (observedSection && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            startLoop();
          } else {
            stopLoop();
          }
        },
        { threshold: 0 }
      );
      observer.observe(observedSection);
    }

    return () => {
      stopLoop();
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", handleResize);
      observer?.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen"
    />
  );
}
