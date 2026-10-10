/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // cache optimized images for 30 days
  },
  experimental: {
    inlineCss: true, // needs Next.js 15.3 or newer
  },
};

export default nextConfig;
