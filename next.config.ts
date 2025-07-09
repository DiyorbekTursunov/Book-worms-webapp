/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    // This will allow the build to continue even if there are type errors
    ignoreBuildErrors: false,
  },

  images: {
    unoptimized: true,
  },

  // Ensure proper API route handling
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
}

export default nextConfig
