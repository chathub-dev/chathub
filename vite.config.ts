import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label'
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import manifest from './manifest.config'

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      tsconfigPaths(),
      react({
        babel: {
          plugins: [jotaiDebugLabel, jotaiReactRefresh],
        },
      }),
      crx({ manifest }),
    ],
    build: {
      rollupOptions: {
        input: ['app.html'],
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            // アイコン関連のパッケージを別チャンクに分割
            icons: ['react-icons'],
          },
        },
      },
      // チャンクサイズ警告のしきい値を設定
      chunkSizeWarningLimit: 1000,
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    optimizeDeps: {
      include: ['react', 'react-dom'], // React と ReactDOM を明示的に含める
    },
    server: {
      strictPort: true,
      port: 5173,
      hmr: {
        clientPort: 5173,
      },
    },
  }
})
