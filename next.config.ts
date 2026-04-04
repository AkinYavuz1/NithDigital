import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for @cloudflare/next-on-pages
  experimental: {
    // Ensure server actions and edge runtime work correctly
  },
  // Exclude large client-only libraries from server/edge bundles
  serverExternalPackages: ['jspdf', 'jspdf-autotable'],
};

export default nextConfig;
