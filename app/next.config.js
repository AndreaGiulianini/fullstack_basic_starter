import path from 'node:path'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 16's Cache Components model: nothing is cached implicitly, the static
  // shell is prerendered and anything dynamic streams in through a Suspense
  // boundary. Also unlocks `use cache`, `cacheLife` and `cacheTag`.
  cacheComponents: true,
  // Stable since Next 16. Auto-memoises components; costs build time because it
  // runs through Babel (needs babel-plugin-react-compiler).
  reactCompiler: true,
  // Self-hosted in Docker: ship only the traced server + deps instead of the
  // whole node_modules tree. The image runs `node server.js`, not `next start`.
  output: 'standalone',
  // The Dockerfile installs node_modules one level above the app directory
  // (/home/node vs /home/node/app), so tracing has to start from the parent or
  // the runtime deps are left out of the standalone bundle.
  outputFileTracingRoot: path.join(import.meta.dirname, '..')
}

export default withNextIntl(nextConfig)
