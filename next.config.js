const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com'
    ],
  },
  typescript: {
    // Ignore all TS errors for now
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore all ESLint errors for now
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
}

module.exports = nextConfig 