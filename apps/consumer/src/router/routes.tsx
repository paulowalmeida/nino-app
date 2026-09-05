import { createBrowserRouter, Navigate, type RouteObject } from 'react-router'

const storefrontLazy = () =>
  import('@pages/Storefront/Storefront').then(({ Storefront }) => ({
    Component: Storefront,
  }))

const productDetailLazy = () =>
  import('@pages/Storefront/ProductDetail/ProductDetail').then(
    ({ ProductDetail }) => ({ Component: ProductDetail })
  )

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

const storeLayoutLazy = () =>
  import('@layouts/StoreLayout/StoreLayout').then(({ StoreLayout }) => ({
    Component: StoreLayout,
  }))

const authenticatedLayoutLazy = () =>
  import('@layouts/AuthenticatedLayout/AuthenticatedLayout').then(
    ({ AuthenticatedLayout }) => ({ Component: AuthenticatedLayout })
  )

const accountLayoutLazy = () =>
  import('@layouts/AccountLayout/AccountLayout').then(({ AccountLayout }) => ({
    Component: AccountLayout,
  }))

const profileLazy = () =>
  import('@pages/Profile/AccountProfile').then(({ AccountProfile }) => ({
    Component: AccountProfile,
  }))

const addressesLazy = () =>
  import('@pages/Addresses/Addresses').then(
    ({ Addresses: AccountAddresses }) => ({
      Component: AccountAddresses,
    })
  )

const ordersLazy = () =>
  import('@pages/Orders/AccountOrders/AccountOrders').then(
    ({ AccountOrders }) => ({
      Component: AccountOrders,
    })
  )

const paymentLazy = () =>
  import('@pages/AccountPayment/AccountPayment').then(
    ({ AccountPayment }) => ({
      Component: AccountPayment,
    })
  )

const conversationsLazy = () =>
  import('@pages/AccountChats/AccountChats').then(({ AccountChats }) => ({
    Component: AccountChats,
  }))

const invoicesLazy = () =>
  import('@pages/AccountInvoices/AccountInvoices').then(({ AccountInvoices }) => ({
    Component: AccountInvoices,
  }))

const accountChildren: RouteObject[] = [
  { index: true, element: <Navigate to="dados" replace /> },
  { path: 'dados', lazy: profileLazy },
  { path: 'enderecos', lazy: addressesLazy },
  { path: 'pedidos', lazy: ordersLazy },
  { path: 'pagamento', lazy: paymentLazy },
  { path: 'conversas', lazy: conversationsLazy },
  { path: 'notas', lazy: invoicesLazy },
]

const customerAccountRoute: RouteObject = {
  path: 'conta',
  lazy: authenticatedLayoutLazy,
  children: [{ lazy: accountLayoutLazy, children: accountChildren }],
}

const storeChildren: RouteObject[] = [
  { index: true, lazy: storefrontLazy },
  { path: 'produto/:productId', lazy: productDetailLazy },
  { path: 'checkout', lazy: checkoutLazy },
  { path: 'pedido/:orderId', lazy: orderTrackingLazy },
  { path: 'entrar', lazy: signInLazy },
  customerAccountRoute,
]

const storeRoute = (path?: string): RouteObject => ({
  ...(path ? { path } : {}),
  lazy: storeLayoutLazy,
  children: storeChildren,
})

export const router = createBrowserRouter([storeRoute(), storeRoute(':slug')])
