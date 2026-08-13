import { createBrowserRouter, Navigate } from 'react-router'

import { AppLayout } from '@layouts/AppLayout/AppLayout'
import { AuthLayout } from '@layouts/AuthLayout/AuthLayout'
import { RouteErrorBoundary } from '@components/RouteErrorBoundary/RouteErrorBoundary'
import { MANAGERS } from '@constants/roles'
import { AuthGuard } from '@guards/auth-guard'
import { FirstStoreGuard } from '@guards/first-store-guard'
import { GuestGuard } from '@guards/guest-guard'
import { roleGuard } from '@guards/role-guard'
import { SessionGuard } from '@guards/session-guard'
import { RootLoader } from '@loaders/root-loader'

export const router = createBrowserRouter([
  {
    path: '/',
    loader: RootLoader,
    errorElement: <RouteErrorBoundary />,
  },
  {
    element: <AuthLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: '/entrar',
        loader: GuestGuard,
        lazy: () =>
          import('@pages/login/Login').then(({ Login }) => ({
            Component: Login,
          })),
      },
      {
        path: '/cadastrar',
        loader: GuestGuard,
        lazy: () =>
          import('@pages/register/Register').then(({ Register }) => ({
            Component: Register,
          })),
      },
    ],
  },
  {
    path: '/lojas',
    loader: SessionGuard,
    errorElement: <RouteErrorBoundary />,
    lazy: () =>
      import('@pages/store-selection/StoreSelection').then(
        ({ StoreSelection }) => ({ Component: StoreSelection })
      ),
  },
  {
    path: '/boas-vindas',
    loader: SessionGuard,
    errorElement: <RouteErrorBoundary />,
    lazy: () =>
      import('@pages/welcome/Welcome').then(({ Welcome }) => ({
        Component: Welcome,
      })),
  },
  {
    path: '/unidades',
    loader: FirstStoreGuard,
    errorElement: <RouteErrorBoundary />,
    lazy: () =>
      import('@pages/units/Units').then(({ Units }) => ({ Component: Units })),
  },
  {
    element: <AppLayout />,
    path: '/:tenantId',
    loader: AuthGuard,
    errorElement: <RouteErrorBoundary />,
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
          import('@pages/counter/Counter').then(({ Counter }) => ({
            Component: Counter,
          })),
      },
      {
        path: 'cozinha',
        lazy: () =>
          import('@pages/kitchen/Kitchen').then(({ Kitchen }) => ({
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
          import('@pages/new-order/NewOrder').then(({ NewOrder }) => ({
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
          import('@pages/new-product/NewProduct').then(({ NewProduct }) => ({
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
          import('@pages/product-detail/ProductDetail').then(({ ProductDetail }) => ({
            Component: ProductDetail,
          })),
      },
      {
        path: 'unidades/nova',
        loader: roleGuard(MANAGERS),
        lazy: () =>
          import('@pages/new-unit/NewUnit').then(({ NewUnit }) => ({
            Component: NewUnit,
          })),
      },
      {
        path: 'relatorios',
        loader: roleGuard(MANAGERS),
        lazy: () =>
          import('@pages/reports/Reports').then(({ Reports }) => ({
            Component: Reports,
          })),
      },
      {
        path: 'clientes',
        loader: roleGuard(MANAGERS),
        lazy: () =>
          import('@pages/customers/Customers').then(({ Customers }) => ({
            Component: Customers,
          })),
      },
      {
        path: 'clientes/:customerId',
        loader: roleGuard(MANAGERS),
        lazy: () =>
          import('@pages/customer-detail/CustomerDetail').then(
            ({ CustomerDetail }) => ({ Component: CustomerDetail })
          ),
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
        path: 'colaboradores/:userId',
        loader: roleGuard(MANAGERS),
        lazy: () =>
          import('@pages/collaborator-detail/CollaboratorDetail').then(
            ({ CollaboratorDetail }) => ({ Component: CollaboratorDetail })
          ),
      },
      {
        path: 'minha-conta',
        lazy: () =>
          import('@pages/account/Account').then(({ Account }) => ({
            Component: Account,
          })),
      },
      {
        path: 'assinatura',
        lazy: () =>
          import('@pages/account-subscription/AccountSubscription').then(
            ({ AccountSubscription }) => ({ Component: AccountSubscription })
          ),
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
              import('@pages/settings-company-section/SettingsCompanySection').then(
                ({ SettingsCompanySection }) => ({
                  Component: SettingsCompanySection,
                })
              ),
          },
          {
            path: 'unidade',
            lazy: () =>
              import('@pages/settings-unit-section/SettingsUnitSection').then(
                ({ SettingsUnitSection }) => ({ Component: SettingsUnitSection })
              ),
          },
          {
            path: 'unidade/detalhe',
            lazy: () =>
              import(
                '@pages/settings-unit-detail-section/SettingsUnitDetailSection'
              ).then(({ SettingsUnitDetailSection }) => ({
                Component: SettingsUnitDetailSection,
              })),
          },
          {
            path: 'atendimento',
            lazy: () =>
              import('@pages/settings-service-section/SettingsServiceSection').then(
                ({ SettingsServiceSection }) => ({
                  Component: SettingsServiceSection,
                })
              ),
          },
          {
            path: 'horarios',
            lazy: () =>
              import('@pages/settings-hours-section/SettingsHoursSection').then(
                ({ SettingsHoursSection }) => ({ Component: SettingsHoursSection })
              ),
          },
          {
            path: 'entrega',
            lazy: () =>
              import('@pages/settings-delivery-section/SettingsDeliverySection').then(
                ({ SettingsDeliverySection }) => ({
                  Component: SettingsDeliverySection,
                })
              ),
          },
          {
            path: 'contato',
            lazy: () =>
              import('@pages/settings-contact-section/SettingsContactSection').then(
                ({ SettingsContactSection }) => ({
                  Component: SettingsContactSection,
                })
              ),
          },
        ],
      },
    ],
  },
])
