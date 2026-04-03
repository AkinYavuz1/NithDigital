import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for @cloudflare/next-on-pages
  experimental: {
    // Ensure server actions and edge runtime work correctly
  },
};

export default nextConfig;
