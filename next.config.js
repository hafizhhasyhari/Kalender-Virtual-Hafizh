/** @type {import('next').NextConfig} */

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['nrozlzseuqdwvmmezjcf.supabase.co'],
  },
};

module.exports = nextConfig;
