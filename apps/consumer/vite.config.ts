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
      '@pages/account': resolve(__dirname, 'src/pages/Account'),
      '@pages/checkout': resolve(__dirname, 'src/pages/Checkout'),
      '@pages/order-tracking': resolve(__dirname, 'src/pages/OrderTracking'),
      '@pages/sign-in': resolve(__dirname, 'src/pages/SignIn'),
      '@adapters': resolve(__dirname, 'src/adapters'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@components': resolve(__dirname, 'src/components'),
      '@compositions': resolve(__dirname, 'src/compositions'),
      '@constants': resolve(__dirname, 'src/shared/constants'),
      '@custom_types/account': resolve(
        __dirname,
        'src/pages/Account/types/account'
      ),
      '@custom_types/checkout': resolve(
        __dirname,
        'src/pages/Checkout/types/checkout'
      ),
      '@custom_types/delivery-zone': resolve(
        __dirname,
        'src/pages/Checkout/types/delivery-zone'
      ),
      '@custom_types/menu': resolve(__dirname, 'src/pages/Home/types/menu'),
      '@custom_types': resolve(__dirname, 'src/shared/types'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@elements': resolve(__dirname, 'src/elements'),
      '@hooks': resolve(__dirname, 'src/shared/hooks'),
      '@layouts': resolve(__dirname, 'src/layouts'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@providers': resolve(__dirname, 'src/providers'),
      '@router': resolve(__dirname, 'src/router'),
      '@shared': resolve(__dirname, 'src/shared'),
      '@utils/category-icon': resolve(__dirname, 'src/pages/Home/utils/category-icon'),
      '@utils/last-order': resolve(__dirname, 'src/shared/lib/last-order'),
      '@utils/menu-image': resolve(__dirname, 'src/pages/Home/utils/menu-image'),
      '@utils/resolve-slug': resolve(__dirname, 'src/shared/lib/resolve-slug'),
      '@utils/session-hint': resolve(__dirname, 'src/shared/lib/session-hint'),
      '@utils': resolve(__dirname, 'src/shared/utils'),
    },
  },
})
