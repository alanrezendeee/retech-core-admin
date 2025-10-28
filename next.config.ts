import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração para Railway
  output: 'standalone',
  
  // Rewrites para proxy da API Go
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:8080'}/:path*`,
      },
    ];
  },

  // Redirects permanentes (SEO-friendly)
  async redirects() {
    return [
      {
        source: '/termos',
        destination: '/legal/termos',
        permanent: true, // 301 redirect - passa autoridade SEO
      },
      {
        source: '/privacidade',
        destination: '/legal/privacidade',
        permanent: true, // 301 redirect
      },
    ];
  },

  // Headers de segurança
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
