import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ['pino', 'thread-stream', 'keyv'],
  compress: true, // Enable Gzip/Brotli compression
  images: {
    formats: ['image/avif', 'image/webp'], // Modern formats
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow external images (Supabase, etc)
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/courses',
        destination: '/educacion/cursos-online',
        permanent: true,
      },
      {
        source: '/libro',
        destination: '/educacion/libro',
        permanent: true, // 301 redirect - preserves SEO
      },
      // Admin routes were moved to /admin, this redirect handles legacy public access attempt
    ];
  },
};

export default nextConfig;
