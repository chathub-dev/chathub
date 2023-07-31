import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import tsconfigPaths from 'vite-tsconfig-paths'
import manifest from './manifest.config'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    plugins: [tsconfigPaths(), react(), crx({ manifest })],
    build: {
      rollupOptions: {
        input: ['app.html'],
      },
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
  }
})
