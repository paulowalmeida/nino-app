import { createBrowserRouter } from 'react-router'

import { Storefront } from '@pages/storefront/Storefront'

/**
 * A loja mora no slug: `/:slug` é a vitrine. A raiz sem loja ainda não tem
 * destino — o acesso real vem por link da loja (slug ou domínio próprio).
 */
export const router = createBrowserRouter([
  {
    path: '/:slug',
    element: <Storefront />,
  },
])
