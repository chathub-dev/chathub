import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import tsconfigPaths from 'vite-tsconfig-paths'
import manifest from './manifest.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react(), crx({ manifest })],
  build: {
    rollupOptions: {
      input: ['src/index.html'],
    },
  },
})
