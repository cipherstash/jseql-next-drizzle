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
  serverExternalPackages: ['@cipherstash/jseql'],
}

export default nextConfig
