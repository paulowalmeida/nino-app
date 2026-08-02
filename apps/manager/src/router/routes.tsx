import { createBrowserRouter, Navigate } from 'react-router'

import { AppLayout } from '@layouts/AppLayout/AppLayout'
import { AuthLayout } from '@layouts/AuthLayout'

import { MANAGERS } from '@constants/roles'

import { AuthGuard } from './auth-guard'
import { FirstStoreGuard } from './first-store-guard'
import { GuestGuard } from './guest-guard'
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
        loader: GuestGuard,
        lazy: () => import('@pages/login/Login').then(({ Login }) => ({
          Component: Login,
        })),
      },
      {
        path: '/cadastrar',
        loader: GuestGuard,
        lazy: () => import('@pages/register/Register').then(({ Register }) => ({
          Component: Register,
        })),
      },
    ],
  },
  {
    path: '/lojas',
    loader: SessionGuard,
    lazy: () =>
      import('@pages/store-selection/StoreSelection').then(
        ({ StoreSelection }) => ({ Component: StoreSelection })
      ),
  },
  {
    path: '/boas-vindas',
    loader: SessionGuard,
    lazy: () =>
      import('@pages/welcome/Welcome').then(({ Welcome }) => ({
        Component: Welcome,
      })),
  },
  {
    path: '/unidades',
    loader: FirstStoreGuard,
    lazy: () =>
      import('@pages/units/Units').then(({ Units }) => ({ Component: Units })),
  },
  {
    element: <AppLayout />,
    path: '/:tenantId',
    loader: AuthGuard,
    children: [
      {
        path: 'visao-geral',
        loader: roleGuard(MANAGERS),
        lazy: () =>
          import('@pages/overview/Overview').then(({ Overview }) => ({
            Component: Overview,
          })),
      },
      {
        path: 'balcao',
        lazy: () =>
          import('@pages/counter').then(({ Counter }) => ({
            Component: Counter,
          })),
      },
      {
        path: 'cozinha',
        lazy: () =>
          import('@pages/kitchen').then(({ Kitchen }) => ({
            Component: Kitchen,
          })),
      },
      {
        path: 'pedidos',
        lazy: () =>
          import('@pages/orders/Orders').then(({ Orders }) => ({
            Component: Orders,
          })),
      },
      {
        path: 'pedidos/novo',
        lazy: () =>
          import('@pages/new-order').then(({ NewOrder }) => ({
            Component: NewOrder,
          })),
      },
      {
        path: 'pedidos/:orderId',
        lazy: () =>
          import('@pages/order-detail/OrderDetail').then(({ OrderDetail }) => ({
            Component: OrderDetail,
          })),
      },
      {
        path: 'catalogo',
        lazy: () =>
          import('@pages/catalog/Catalog').then(({ Catalog }) => ({
            Component: Catalog,
          })),
      },
      {
        path: 'catalogo/novo',
        lazy: () =>
          import('@pages/new-product').then(({ NewProduct }) => ({
            Component: NewProduct,
          })),
      },
      {
        path: 'catalogo/categorias',
        loader: roleGuard(['TENANT_OWNER']),
        lazy: () =>
          import('@pages/categories/Categories').then(({ Categories }) => ({
            Component: Categories,
          })),
      },
      {
        path: 'catalogo/:productId',
        lazy: () =>
          import('@pages/product-detail').then(({ ProductDetail }) => ({
            Component: ProductDetail,
          })),
      },
      {
        path: 'unidades/nova',
        loader: roleGuard(MANAGERS),
        lazy: () =>
          import('@pages/new-unit').then(({ NewUnit }) => ({
            Component: NewUnit,
          })),
      },
      {
        path: 'relatorios',
        loader: roleGuard(MANAGERS),
        lazy: () =>
          import('@pages/reports').then(({ Reports }) => ({
            Component: Reports,
          })),
      },
      {
        path: 'clientes',
        loader: roleGuard(MANAGERS),
        lazy: () =>
          import('@pages/customers').then(({ Customers }) => ({
            Component: Customers,
          })),
      },
      {
        path: 'clientes/:customerId',
        loader: roleGuard(MANAGERS),
        lazy: () =>
          import('@pages/customers').then(({ CustomerDetail }) => ({
            Component: CustomerDetail,
          })),
      },
      {
        path: 'colaboradores',
        loader: roleGuard(MANAGERS),
        lazy: () =>
          import('@pages/employees/Employees').then(({ Employees }) => ({
            Component: Employees,
          })),
      },
      {
        path: 'minha-conta',
        lazy: () =>
          import('@pages/account').then(({ Account }) => ({
            Component: Account,
          })),
      },
      {
        path: 'assinatura',
        lazy: () =>
          import('@pages/account').then(({ Subscription }) => ({
            Component: Subscription,
          })),
      },
      {
        path: 'configuracoes',
        loader: roleGuard(MANAGERS),
        lazy: () =>
          import('@pages/settings/Settings').then(({ Settings }) => ({
            Component: Settings,
          })),
        children: [
          { index: true, element: <Navigate to="empresa" replace /> },
          {
            path: 'empresa',
            lazy: () =>
              import('@pages/settings/sections').then(
                ({ CompanySection }) => ({ Component: CompanySection })
              ),
          },
          {
            path: 'unidade',
            lazy: () =>
              import('@pages/settings/sections').then(({ UnitSection }) => ({
                Component: UnitSection,
              })),
          },
          {
            path: 'unidade/detalhe',
            lazy: () =>
              import('@pages/settings/sections').then(
                ({ UnitDetailSection }) => ({ Component: UnitDetailSection })
              ),
          },
          {
            path: 'atendimento',
            lazy: () =>
              import('@pages/settings/sections').then(
                ({ ServiceSection }) => ({ Component: ServiceSection })
              ),
          },
          {
            path: 'horarios',
            lazy: () =>
              import('@pages/settings/sections').then(({ HoursSection }) => ({
                Component: HoursSection,
              })),
          },
          {
            path: 'entrega',
            lazy: () =>
              import('@pages/settings/sections').then(
                ({ DeliverySection }) => ({ Component: DeliverySection })
              ),
          },
          {
            path: 'contato',
            lazy: () =>
              import('@pages/settings/sections').then(
                ({ ContactSection }) => ({ Component: ContactSection })
              ),
          },
        ],
      },
    ],
  },
])
