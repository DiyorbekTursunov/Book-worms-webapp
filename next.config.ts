/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable telemetry
  telemetry: false,

  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },
}

export default nextConfig
