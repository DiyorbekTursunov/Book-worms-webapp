/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Don't run ESLint during builds in production
    ignoreDuringBuilds: true,
  },

  typescript: {
    // Don't fail the build on TypeScript errors
    ignoreBuildErrors: false,
  },

  images: {
    unoptimized: true,
  },

  // Ensure proper handling of API routes
  async rewrites() {
    return []
  },
}

export default nextConfig
