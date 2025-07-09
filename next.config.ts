/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here
  },

  eslint: {
    // Don't run ESLint during builds in production
    ignoreDuringBuilds: true,
  },

  typescript: {
    // Don't run TypeScript checks during builds in production
    ignoreBuildErrors: false,
  },

  images: {
    unoptimized: true,
  },
}

export default nextConfig
