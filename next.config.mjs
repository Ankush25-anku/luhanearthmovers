/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // Next's built-in image optimizer re-encodes every next/image asset on
    // request — offering AVIF first (falling back to WebP, then the
    // original) shrinks payloads further for supporting browsers with no
    // visual/config change at the call sites.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
