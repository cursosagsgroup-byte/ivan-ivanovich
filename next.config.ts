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
        // La página en inglés se fusionó con la de español: una sola ruta
        // que sirve ambos idiomas. Permanente: la URL vieja no volverá.
        source: '/educacion/counter-surveillance',
        destination: '/en/educacion/contravigilancia',
        permanent: true,
      },
      {
        source: '/en/educacion/counter-surveillance',
        destination: '/en/educacion/contravigilancia',
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
      // Landings de cursos presenciales ya celebrados. Sus cursos están
      // despublicados, así que el botón de compra fallaría: se redirige el
      // tráfico que aún llega desde Google o enlaces antiguos al catálogo.
      // Redirección temporal (307) a propósito: si se reactiva una edición,
      // basta con quitar la regla y volver a publicar el curso.
      {
        source: '/proteccion-ejecutiva-operatividad-general',
        destination: '/educacion/cursos-presenciales',
        permanent: false,
      },
      {
        source: '/alerta-temprana-mexico',
        destination: '/educacion/cursos-presenciales',
        permanent: false,
      },
      {
        source: '/proteccion-ejecutiva-costa-rica',
        destination: '/educacion/cursos-presenciales',
        permanent: false,
      },
      // Admin routes were moved to /admin, this redirect handles legacy public access attempt
    ];
  },
  async headers() {
    return [
      {
        // Cabeceras de seguridad en todo el sitio. Google las considera señal
        // de calidad y protegen contra clickjacking y sniffing de tipos MIME.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ]
      },
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
