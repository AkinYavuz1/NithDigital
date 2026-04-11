import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['jspdf', 'jspdf-autotable', 'nodemailer', 'twilio'],
  experimental: {
    turbo: {
      resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'twilio']
    }
    return config
  },
};

export default nextConfig;
