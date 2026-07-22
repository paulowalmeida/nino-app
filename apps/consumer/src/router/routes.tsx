import { createBrowserRouter } from 'react-router'

import { Checkout } from '@pages/checkout/Checkout'
import { OrderTracking } from '@pages/order-tracking/OrderTracking'
import { Storefront } from '@pages/storefront/Storefront'

/**
 * A loja vem do subdomínio (`slug.nino.delivery`), então a raiz já é a
 * vitrine. `/:slug` no caminho é o atalho de desenvolvimento em
 * `localhost/slug`, sem precisar de subdomínio. `/checkout` e `/pedido/:id`
 * seguem o mesmo par de rotas para funcionar nos dois modos.
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
  {
    path: '/checkout',
    element: <Checkout />,
  },
  {
    path: '/:slug/checkout',
    element: <Checkout />,
  },
  {
    path: '/pedido/:orderId',
    element: <OrderTracking />,
  },
  {
    path: '/:slug/pedido/:orderId',
    element: <OrderTracking />,
  },
])
