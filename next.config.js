/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['covers.openlibrary.org'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@prisma/client')
    }
    return config
  },
}

module.exports = nextConfig
