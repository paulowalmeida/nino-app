import { createBrowserRouter } from 'react-router'

const storefrontLazy = () =>
  import('@pages/storefront/Storefront').then(({ Storefront }) => ({
    Component: Storefront,
  }))

const checkoutLazy = () =>
  import('@pages/checkout/Checkout').then(({ Checkout }) => ({
    Component: Checkout,
  }))

const orderTrackingLazy = () =>
  import('@pages/order-tracking/OrderTracking').then(({ OrderTracking }) => ({
    Component: OrderTracking,
  }))

/**
 * A loja vem do subdomínio (`slug.nino.delivery`), então a raiz já é a
 * vitrine. `/:slug` no caminho é o atalho de desenvolvimento em
 * `localhost/slug`, sem precisar de subdomínio. `/checkout` e `/pedido/:id`
 * seguem o mesmo par de rotas para funcionar nos dois modos.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    lazy: storefrontLazy,
  },
  {
    path: '/:slug',
    lazy: storefrontLazy,
  },
  {
    path: '/checkout',
    lazy: checkoutLazy,
  },
  {
    path: '/:slug/checkout',
    lazy: checkoutLazy,
  },
  {
    path: '/pedido/:orderId',
    lazy: orderTrackingLazy,
  },
  {
    path: '/:slug/pedido/:orderId',
    lazy: orderTrackingLazy,
  },
])
