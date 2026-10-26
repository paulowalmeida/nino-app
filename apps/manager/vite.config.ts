import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

const API = 'https://api-dev.nino.delivery'

const DS_SOURCE = resolve(__dirname, '../../packages/ds/src')
const BARE_IMPORT = /from '((?:@[\w-]+\/)?[\w-][^']*)'/g
const DS_INTERNAL = /^(react|@ds\/|@nino\/|@storybook\/|@testing-library\/|vitest)/

const dsDependencies = () => {
  const sources = readdirSync(DS_SOURCE, { recursive: true, encoding: 'utf8' })
    .filter((file) => /\.tsx?$/.test(file) && !/\.(test|stories|mock)\./.test(file))
  const imports = sources.flatMap((file) =>
    [...readFileSync(resolve(DS_SOURCE, file), 'utf8').matchAll(BARE_IMPORT)].map(
      ([, specifier]) => specifier
    )
  )
  return [...new Set(imports)].filter((specifier) => !DS_INTERNAL.test(specifier))
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  /* O design system aponta diretamente para TypeScript do workspace. Se ele
   * for pré-otimizado, o dev server mantém uma cópia em cache e ignora HMR. */
  optimizeDeps: {
    exclude: ['@nino/ds'],
    // WHY: excluir o DS tira as dependências dele do scan; o Vite só descobre
    // `@ark-ui/react/*` quando a rota lazy carrega, reotimiza e recarrega a
    // página antes da navegação concluir.
    include: ['@vis.gl/react-google-maps', ...dsDependencies()],
  },
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
      '@guards': resolve(__dirname, 'src/guards'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@loaders': resolve(__dirname, 'src/loaders'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@providers': resolve(__dirname, 'src/providers'),
      '@router': resolve(__dirname, 'src/router'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@layouts': resolve(__dirname, 'src/layouts'),
      '@shared': resolve(__dirname, 'src/shared'),
    },
  },
})
