import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  resolve: {
    tsconfigPaths: true
  },
  plugins: [tailwindcss(), tanstackStart({ srcDirectory: 'src' }), viteReact(), nitro()]
})
