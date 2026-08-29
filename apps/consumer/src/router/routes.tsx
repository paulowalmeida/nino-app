import { createBrowserRouter, Navigate, type RouteObject } from 'react-router'

const homeLazy = () =>
  import('@pages/Home/Home').then(({ Home }) => ({ Component: Home }))

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
  import('@pages/account/components/AccountProfile/AccountProfile').then(
    ({ AccountProfile }) => ({ Component: AccountProfile })
  )

const addressesLazy = () =>
  import('@pages/account/components/AccountAddresses/AccountAddresses').then(
    ({ AccountAddresses }) => ({ Component: AccountAddresses })
  )

const ordersLazy = () =>
  import('@pages/account/components/AccountOrders/AccountOrders').then(
    ({ AccountOrders }) => ({ Component: AccountOrders })
  )

const paymentLazy = () =>
  import('@pages/account/components/AccountPayment/AccountPayment').then(
    ({ AccountPayment }) => ({ Component: AccountPayment })
  )

const chatsLazy = () =>
  import('@pages/account/components/AccountChats/AccountChats').then(
    ({ AccountChats }) => ({ Component: AccountChats })
  )

const invoicesLazy = () =>
  import('@pages/account/components/AccountInvoices/AccountInvoices').then(
    ({ AccountInvoices }) => ({ Component: AccountInvoices })
  )

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
    lazy: homeLazy,
  },
  {
    path: '/:slug',
    lazy: homeLazy,
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
