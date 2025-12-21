import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ['pino', 'thread-stream', 'keyv'],
  images: {
    unoptimized: true, // Often safer for cPanel shared hosting to avoid optimization library issues
  },
};

export default nextConfig;
