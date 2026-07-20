import { createBrowserRouter } from 'react-router'

import { Storefront } from '@pages/storefront/Storefront'

/**
 * A loja vem do subdomínio (`slug.nino.delivery`), então a raiz já é a
 * vitrine. `/:slug` no caminho é o atalho de desenvolvimento em
 * `localhost/slug`, sem precisar de subdomínio.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Storefront />,
  },
  {
    path: '/:slug',
    element: <Storefront />,
  },
])
