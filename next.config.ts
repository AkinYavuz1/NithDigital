import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['jspdf', 'jspdf-autotable', 'nodemailer', 'twilio'],
};

export default nextConfig;
