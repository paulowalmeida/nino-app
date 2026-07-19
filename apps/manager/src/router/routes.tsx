import { createBrowserRouter } from 'react-router'

import { AppLayout } from '@layouts/AppLayout/AppLayout'
import { AuthLayout } from '@layouts/AuthLayout'
import { Catalog } from '@pages/catalog/Catalog'
import { Employees } from '@pages/employees/Employees'
import { CreateStore } from '@pages/first-store/FirstStore'
import { Login } from '@pages/login/Login'
import { OrderDetail } from '@pages/order-detail/OrderDetail'
import { Orders } from '@pages/orders/Orders'
import { Overview } from '@pages/overview/Overview'
import { ProductDetail } from '@pages/product-detail'
import { Register } from '@pages/register/Register'
import { Settings } from '@pages/settings/Settings'
import { StoreSelection } from '@pages/store-selection/StoreSelection'

import { AuthGuard } from './auth-guard'
import { RootLoader } from './root-loader'
import { SessionGuard } from './session-guard'

export const router = createBrowserRouter([
  {
    path: '/',
    loader: RootLoader,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/entrar',
        element: <Login />,
      },
      {
        path: '/cadastrar',
        element: <Register />,
      },
    ],
  },
  {
    path: '/lojas',
    element: <StoreSelection />,
    loader: SessionGuard,
  },
  {
    path: '/criar-loja',
    element: <CreateStore />,
    loader: SessionGuard,
  },
  {
    element: <AppLayout />,
    path: '/:tenantId',
    loader: AuthGuard,
    children: [
      {
        path: 'visao-geral',
        element: <Overview />,
      },
      {
        path: 'pedidos',
        element: <Orders />,
      },
      {
        path: 'pedidos/:orderId',
        element: <OrderDetail />,
      },
      {
        path: 'catalogo',
        element: <Catalog />,
      },
      {
        path: 'catalogo/:productId',
        element: <ProductDetail />,
      },
      {
        path: 'colaboradores',
        element: <Employees />,
      },
      {
        path: 'configuracoes',
        element: <Settings />,
      },
    ],
  },
])
