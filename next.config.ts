import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true, // Help catch bugs early
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // Remove console.logs in production
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false, // Disable the `x-powered-by` header
};

export default nextConfig;
