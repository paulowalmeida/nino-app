import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const API = 'https://api-dev.nino.delivery'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  /**
   * O nome gerado carrega o arquivo de origem (`Alert-module__title___a1b2c`)
   * em vez de só a classe: no DevTools o hash sozinho não diz de qual
   * componente a regra veio, que é o que trava a busca ao depurar estilo.
   */
  css: {
    modules: {
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
  },
  /**
   * 3001 is the manager's port in dev (consumer owns 3002).
   *
   * The `/api` proxy exists so the browser sees a single origin while the app
   * runs locally against the deployed API: the session cookies are
   * `sameSite: 'strict'`, so a page on localhost would store them at login and
   * never send them again — every request would answer 401. It only applies to
   * `vite dev`; `vite build` ignores this block, so production is untouched.
   *
   * `headers.origin` rewrites the browser's `Origin` to the API's own host:
   * Chrome sends it on POST and not on a simple GET, so a localhost origin
   * outside the API's allowlist breaks writes while reads keep working.
   * Rewriting here keeps the deployed allowlist closed to localhost.
   */
  server: {
    port: 3001,
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
      '@adapters': resolve(__dirname, 'src/adapters'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@atoms': resolve(__dirname, 'src/UI/atoms'),
      '@constants': resolve(__dirname, 'src/constants'),
      '@custom_types': resolve(__dirname, 'src/types'),
      '@guards': resolve(__dirname, 'src/guards'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@loaders': resolve(__dirname, 'src/loaders'),
      '@molecules': resolve(__dirname, 'src/UI/molecules'),
      '@organisms': resolve(__dirname, 'src/UI/organisms'),
      '@pages': resolve(__dirname, 'src/UI/pages'),
      '@providers': resolve(__dirname, 'src/providers'),
      '@router': resolve(__dirname, 'src/router'),
      '@services': resolve(__dirname, 'src/services'),
      '@skeletons': resolve(__dirname, 'src/skeletons'),
      '@states': resolve(__dirname, 'src/states'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@layouts': resolve(__dirname, 'src/UI/layouts'),
      '@utils': resolve(__dirname, 'src/utils'),
    },
  },
})
