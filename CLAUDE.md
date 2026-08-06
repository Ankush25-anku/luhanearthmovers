# Luhan Earth Movers - AI Development Guide

# Project Overview

Build a world-class, award-winning corporate website for:

LUHAN EARTH MOVERS

using modern web technologies.

The website should feel:

Premium
Cinematic
Industrial
Powerful
Trustworthy
Engineering-focused

This is NOT a template website.

The visual quality should be comparable to websites featured on:

- Awwwards
- CSS Design Awards
- Cuberto
- Active Theory
- Dogstudio
- Locomotive
- Basement Studio

# Brand Identity

Company:

Luhan Earth Movers

Industry:

- Earth Moving
- Excavation
- Heavy Machinery
- Infrastructure Development
- Construction Services
- Mining Support
- Land Development

The website should immediately communicate:

- Heavy equipment expertise
- Large-scale project capability
- Engineering precision
- Reliability
- Professional execution

# Tech Stack

Framework:

- Next.js 15 App Router
- JavaScript

Styling:

- Tailwind CSS

Animation:

- GSAP
- GSAP ScrollTrigger
- Lenis Smooth Scroll
- Framer Motion

3D / Advanced Visuals:

- Three.js
- React Three Fiber
- Drei

Icons:

- Lucide React

# Design Language

Style:

Modern Industrial Luxury

Keywords:

Heavy Machinery

Earth

Steel

Concrete

Engineering

Construction

Architecture

Depth

Large Typography

Negative Space

Cinematic Lighting

Industrial Premium

# Color Palette

Primary Orange:

#F97316

Background:

#111111

Secondary Background:

#1A1A1A

Surface:

#262626

Text:

#FAFAFA

Muted Text:

#BDBDBD

Accent:

#FF8C42

# Typography

Headings:

Space Grotesk

Body:

Inter

Numbers:

Bebas Neue

# Layout System

Maximum Website Width:

1440px

Content Width:

1280px

Padding:

Desktop:

px-12

Tablet:

px-8

Mobile:

px-6

# Spacing Rules

Always maintain premium whitespace.

Desktop:

120px - 180px

Tablet:

90px - 120px

Mobile:

64px - 90px

Never create crowded layouts.

# Animation Philosophy

Animations should feel:

Cinematic

Premium

Purposeful

Never over animate.

## GSAP Usage

Use GSAP for:

- Hero animations
- Scroll reveals
- Text animations
- Image reveals
- Parallax
- Pinned sections
- Horizontal scrolling
- Timeline based storytelling
- Canvas animations

## Framer Motion Usage

Use Framer Motion only for:

- Buttons
- Cards
- Hover interactions
- Small UI animations

Do not use Framer Motion for large scroll animations.

# Hero Section Rules

Hero is the most important section.

The hero can use:

- Video
- Canvas frame sequences
- GSAP ScrollTrigger
- Cinematic transitions

Requirements:

- Smooth scrolling
- No frame jumping
- No scroll lag
- GPU accelerated rendering
- Optimized canvas rendering

Frame sequence rules:

- Never reload images during scroll
- Use refs instead of React state
- Prevent unnecessary canvas redraws
- Use requestAnimationFrame efficiently
- Handle mobile performance carefully

Hero must feel similar to:

Awwwards level interactive websites.

# Smooth Scrolling

Use Lenis globally.

Lenis must synchronize with GSAP ticker.

Required:

Lenis scroll event:

↓

ScrollTrigger.update()

↓

GSAP ticker

Never use:

CSS scroll-behavior:smooth

# Responsive Rules

Every section must work perfectly on:

Mobile:

320px
375px
390px
430px

Tablet:

768px
820px
1024px

Desktop:

1280px
1440px
1920px

Desktop experience should translate into mobile/tablet.

Do NOT remove animations only because of mobile.

Instead:

- optimize
- simplify calculations
- reduce heavy rendering
- maintain visual quality

# Performance Rules

Prioritize:

60 FPS animations

Always:

- Lazy load heavy sections
- Optimize images
- Avoid unnecessary React renders
- Use GPU accelerated transforms
- Cleanup GSAP ScrollTriggers
- Cleanup animation listeners
- Avoid memory leaks

For canvas/video:

Optimize:

- frame loading
- memory usage
- rendering frequency
- device pixel ratio

# Component Rules

Every component must be:

Reusable

Responsive

Accessible

Clean

Well commented

Structure:

components/

sections/

animations/

hooks/

lib/

data/

# Code Quality

Use:

Functional React components

Avoid:

- duplicated logic
- unnecessary state
- inline styles

Prefer:

Tailwind utilities

Keep files modular.

# Accessibility

Every component must include:

- Semantic HTML
- Keyboard navigation
- Focus states
- Proper aria labels
- Good contrast

# Development Rules

Before modifying any section:

1. Read existing component
2. Understand current animation logic
3. Do not break desktop experience
4. Test responsive behavior
5. Keep existing architecture

# Design Philosophy

Every section must feel like one premium experience.

Nothing should look like:

- Bootstrap template
- Generic corporate website
- Stock landing page

The final website should feel like:

"India's premium heavy equipment and infrastructure company website."
