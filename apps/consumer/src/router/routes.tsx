import { createBrowserRouter, Navigate, type RouteObject } from 'react-router'

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

const signInLazy = () =>
  import('@pages/sign-in/SignIn').then(({ SignIn }) => ({ Component: SignIn }))

const accountLazy = () =>
  import('@pages/account/Account').then(({ Account }) => ({
    Component: Account,
  }))

const profileLazy = () =>
  import('@pages/account/sections/Profile/Profile').then(({ Profile }) => ({
    Component: Profile,
  }))

const addressesLazy = () =>
  import('@pages/account/sections/Addresses/Addresses').then(
    ({ Addresses }) => ({ Component: Addresses })
  )

const ordersLazy = () =>
  import('@pages/account/sections/Orders/Orders').then(({ Orders }) => ({
    Component: Orders,
  }))

const paymentLazy = () =>
  import('@pages/account/sections/Soon/Payment').then(({ Payment }) => ({
    Component: Payment,
  }))

const chatsLazy = () =>
  import('@pages/account/sections/Soon/Chats').then(({ Chats }) => ({
    Component: Chats,
  }))

const invoicesLazy = () =>
  import('@pages/account/sections/Soon/Invoices').then(({ Invoices }) => ({
    Component: Invoices,
  }))

/**
 * As gavetas da conta. Cada uma é uma rota para que a URL seja o estado:
 * link compartilhável, voltar do navegador funciona e o F5 devolve a pessoa
 * na seção em que ela estava.
 */
const accountChildren: RouteObject[] = [
  { index: true, element: <Navigate to="dados" replace /> },
  { path: 'dados', lazy: profileLazy },
  { path: 'enderecos', lazy: addressesLazy },
  { path: 'pedidos', lazy: ordersLazy },
  { path: 'pagamento', lazy: paymentLazy },
  { path: 'conversas', lazy: chatsLazy },
  { path: 'notas', lazy: invoicesLazy },
]

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
  {
    path: '/entrar',
    lazy: signInLazy,
  },
  {
    path: '/:slug/entrar',
    lazy: signInLazy,
  },
  {
    path: '/conta',
    lazy: accountLazy,
    children: accountChildren,
  },
  {
    path: '/:slug/conta',
    lazy: accountLazy,
    children: accountChildren,
  },
])
