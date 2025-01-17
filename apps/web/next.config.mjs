const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cipherstash.com',
      },
    ],
  },
  transpilePackages: ['@jseql-next-drizzle/core'],
  // serverExternalPackages: ['@cipherstash/jseql'],
  experimental: {
    serverComponentsExternalPackages: ['@cipherstash/jseql'],
  },
}

export default nextConfig
