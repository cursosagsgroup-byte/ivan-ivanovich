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
        source: '/courses/:slug(contravigilancia|counter-surveillance|team-leader|cursos-online|cursos-presenciales|libro|certificado-deta)',
        destination: '/educacion/:slug',
        permanent: true,
      },
      {
        source: '/cursos',
        destination: '/educacion/cursos-presenciales',
        permanent: true, // 301 redirect - preserves SEO
      },
      {
        source: '/libro',
        destination: '/educacion/libro',
        permanent: true, // 301 redirect - preserves SEO
      },
      // Admin routes were moved to /admin, this redirect handles legacy public access attempt
    ];
  },
  async headers() {
    return [
      {
        source: "/api/mobile/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // In production, replace * with your app's domain if applicable
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ]
      }
    ]
  }
};

export default nextConfig;
