/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Exclude the problematic directories from webpack processing
    config.watchOptions = {
      ignored: ['**/node_modules', '**/.*/', '**/Application Data/**']
    }
    return config
  },
}

export default nextConfig
