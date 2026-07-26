import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const API = 'https://api-dev.nino.delivery'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  /**
   * 3002 is the consumer's port in dev (manager owns 3001).
   *
   * The `/api` proxy exists so the browser sees a single origin while the app
   * runs locally against the deployed API: the session cookies are
   * `sameSite: 'strict'`, so a page on localhost would store them at login and
   * never send them again — every request would answer 401. It only applies to
   * `vite dev`; `vite build` ignores this block, so production is untouched.
   * Point `VITE_BASE_URL` at `/api` in `.env.local` to use it.
   *
   * `headers.origin` rewrites the browser's `Origin` to the API's own host,
   * because Chrome sends `Origin: http://localhost:3002` on POST (and not on
   * a simple GET) and localhost is not in the API's CORS allowlist — the
   * menu loaded and only the checkout was refused. Rewriting here keeps the
   * deployed allowlist closed instead of opening it to localhost.
   */
  server: {
    port: 3002,
    strictPort: true,
    proxy: {
      '/api': {
        target: API,
        changeOrigin: true,
        secure: true,
        headers: { origin: API },
        rewrite: (path) => path.replace(/^\/api/, ''),
        cookieDomainRewrite: 'localhost',
      },
    },
  },
  resolve: {
    alias: {
      '@ds': resolve(__dirname, '../../packages/ds/src'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@components': resolve(__dirname, 'src/components'),
      '@compositions': resolve(__dirname, 'src/compositions'),
      '@constants': resolve(__dirname, 'src/constants'),
      '@custom_types': resolve(__dirname, 'src/types'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@layouts': resolve(__dirname, 'src/layouts'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@providers': resolve(__dirname, 'src/providers'),
      '@router': resolve(__dirname, 'src/router'),
      '@services': resolve(__dirname, 'src/services'),
      '@states': resolve(__dirname, 'src/states'),
      '@utils': resolve(__dirname, 'src/utils'),
    },
  },
})
