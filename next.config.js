/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      }
    ],
  },
  // In Next.js non c'è la configurazione server nel config
  // La porta viene gestita dagli script npm
}

module.exports = nextConfig 