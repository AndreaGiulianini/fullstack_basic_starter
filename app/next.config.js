/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    appDir: false,
  },
  env: {
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
  },
}

export default nextConfig
