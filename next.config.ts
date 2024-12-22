import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cipherstash.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Only apply this rule on the server build, because
    // .node modules can’t run in a browser environment
    if (isServer) {
      config.module.rules.push({
        test: /\.node$/,
        use: 'node-loader',
      })
    }
    return config
  },
}

export default nextConfig
