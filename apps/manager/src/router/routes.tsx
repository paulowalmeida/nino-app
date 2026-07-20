import { createBrowserRouter, Navigate } from 'react-router'

import { AppLayout } from '@layouts/AppLayout/AppLayout'
import { AuthLayout } from '@layouts/AuthLayout'
import { Catalog } from '@pages/catalog/Catalog'
import { Counter } from '@pages/counter'
import { Employees } from '@pages/employees/Employees'
import { CreateStore } from '@pages/first-store/FirstStore'
import { Account, Subscription } from '@pages/account'
import { Login } from '@pages/login/Login'
import { NewOrder } from '@pages/new-order'
import { NewProduct } from '@pages/new-product'
import { OrderDetail } from '@pages/order-detail/OrderDetail'
import { Orders } from '@pages/orders/Orders'
import { Overview } from '@pages/overview/Overview'
import { ProductDetail } from '@pages/product-detail'
import { Register } from '@pages/register/Register'
import { Settings } from '@pages/settings/Settings'
import {
  CompanySection,
  ContactSection,
  DeliverySection,
  HoursSection,
  ServiceSection,
  UnitSection,
} from '@pages/settings/sections'
import { StoreSelection } from '@pages/store-selection/StoreSelection'

import { MANAGERS } from '@constants/roles'

import { AuthGuard } from './auth-guard'
import { roleGuard } from './role-guard'
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
        loader: roleGuard(MANAGERS),
      },
      {
        path: 'balcao',
        element: <Counter />,
      },
      {
        path: 'pedidos',
        element: <Orders />,
      },
      {
        path: 'pedidos/novo',
        element: <NewOrder />,
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
        path: 'catalogo/novo',
        element: <NewProduct />,
      },
      {
        path: 'catalogo/:productId',
        element: <ProductDetail />,
      },
      {
        path: 'colaboradores',
        element: <Employees />,
        loader: roleGuard(MANAGERS),
      },
      {
        path: 'minha-conta',
        element: <Account />,
      },
      {
        path: 'assinatura',
        element: <Subscription />,
      },
      {
        path: 'configuracoes',
        element: <Settings />,
        loader: roleGuard(MANAGERS),
        children: [
          { index: true, element: <Navigate to="empresa" replace /> },
          { path: 'empresa', element: <CompanySection /> },
          { path: 'unidade', element: <UnitSection /> },
          { path: 'atendimento', element: <ServiceSection /> },
          { path: 'horarios', element: <HoursSection /> },
          { path: 'entrega', element: <DeliverySection /> },
          { path: 'contato', element: <ContactSection /> },
        ],
      },
    ],
  },
])
