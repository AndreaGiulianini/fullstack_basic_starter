import path from 'node:path'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  output: 'standalone',
  outputFileTracingRoot: path.join(import.meta.dirname, '..')
}

export default withNextIntl(nextConfig)
