import { createBrowserRouter, Navigate, type RouteObject } from 'react-router'

const Home = () =>
  import('@pages/home/Home').then(({ Home: Home }) => ({
    Component: Home,
  }))

const checkout = () =>
  import('@pages/checkout/Checkout').then(({ Checkout }) => ({
    Component: Checkout,
  }))

const orderTracking = () =>
  import('@pages/order-tracking/OrderTracking').then(({ OrderTracking }) => ({
    Component: OrderTracking,
  }))

const signIn = () =>
  import('@pages/sign-in/SignIn').then(({ SignIn }) => ({ Component: SignIn }))

const account = () =>
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

const accountChildren: RouteObject[] = [
  { index: true, element: <Navigate to="dados" replace /> },
  { path: 'dados', lazy: profileLazy },
  { path: 'enderecos', lazy: addressesLazy },
  { path: 'pedidos', lazy: ordersLazy },
  { path: 'pagamento', lazy: paymentLazy },
  { path: 'conversas', lazy: chatsLazy },
  { path: 'notas', lazy: invoicesLazy },
]

export const router = createBrowserRouter([
  {
    path: '/',
    lazy: Home,
  },
  {
    path: '/:slug',
    lazy: Home,
  },
  {
    path: '/checkout',
    lazy: checkout,
  },
  {
    path: '/:slug/checkout',
    lazy: checkout,
  },
  {
    path: '/pedido/:orderId',
    lazy: orderTracking,
  },
  {
    path: '/:slug/pedido/:orderId',
    lazy: orderTracking,
  },
  {
    path: '/entrar',
    lazy: signIn,
  },
  {
    path: '/:slug/entrar',
    lazy: signIn,
  },
  {
    path: '/conta',
    lazy: account,
    children: accountChildren,
  },
  {
    path: '/:slug/conta',
    lazy: account,
    children: accountChildren,
  },
])
