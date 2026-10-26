import { resolve } from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_PROXY_TARGET || 'https://api-dev.nino.delivery'

  return {
    plugins: [react(), tailwindcss()],
    optimizeDeps: {
      exclude: ['@nino/ds'],
    },
    server: {
      port: 3004,
      strictPort: true,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: apiTarget.startsWith('https://'),
          headers: { origin: apiTarget },
          rewrite: (path) => path.replace(/^\/api/, ''),
          cookieDomainRewrite: 'localhost',
        },
      },
    },
    resolve: {
      alias: {
        '@app': resolve(__dirname, 'src'),
        '@ds': resolve(__dirname, '../../packages/ds/src'),
      },
    },
  }
})
