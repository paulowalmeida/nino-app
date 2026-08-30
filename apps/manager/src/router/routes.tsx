import { createBrowserRouter, Navigate } from 'react-router'

import { RootLoader } from '@loaders/root-loader'

import { AuthGuard } from '@guards/auth-guard'
import { FirstStoreGuard } from '@guards/first-store-guard'
import { GuestGuard } from '@guards/guest-guard'
import { roleGuard } from '@guards/role-guard'
import { SessionGuard } from '@guards/session-guard'
import { AppLayout } from '@layouts/AppLayout/AppLayout'
import { AuthLayout } from '@layouts/AuthLayout/AuthLayout'
import { RegisterLayout } from '@layouts/RegisterLayout/RegisterLayout'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { RouteErrorBoundary } from '@shared/components/RouteErrorBoundary/RouteErrorBoundary'
import { MANAGERS } from '@shared/constants/roles.constants'

export const router = createBrowserRouter([
  {
    path: '/',
    loader: RootLoader,
    hydrateFallbackElement: <Skeleton />,
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
          import('@pages/Login/Login').then(({ Login }) => ({
            Component: Login,
          })),
      },
    ],
  },
  {
    element: <RegisterLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: '/cadastrar',
        loader: GuestGuard,
        lazy: () =>
          import('@pages/Register/Register').then(({ Register }) => ({
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
      import('@pages/StoreSelection/StoreSelection').then(
        ({ StoreSelection }) => ({ Component: StoreSelection })
      ),
  },
  {
    path: '/boas-vindas',
    loader: SessionGuard,
    errorElement: <RouteErrorBoundary />,
    lazy: () =>
      import('@pages/Welcome/Welcome').then(({ Welcome }) => ({
        Component: Welcome,
      })),
  },
  {
    path: '/unidades',
    loader: FirstStoreGuard,
    errorElement: <RouteErrorBoundary />,
    lazy: () =>
      import('@pages/Units/Units').then(({ Units }) => ({ Component: Units })),
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
          import('@pages/Overview/Overview').then(({ Overview }) => ({
            Component: Overview,
          })),
      },
      {
        path: 'balcao',
        lazy: () =>
          import('@pages/Counter/Counter').then(({ Counter }) => ({
            Component: Counter,
          })),
      },
      {
        path: 'caixa',
        lazy: () =>
          import('@pages/Cash/Cash').then(({ Cash }) => ({
            Component: Cash,
          })),
      },
      {
        path: 'comandas',
        lazy: () =>
          import('@pages/TableTabs/TableTabs').then(({ TableTabs }) => ({
            Component: TableTabs,
          })),
      },
      {
        path: 'comandas/:tabId',
        lazy: () =>
          import('@pages/TableTabDetail/TableTabDetail').then(
            ({ TableTabDetail }) => ({ Component: TableTabDetail })
          ),
      },
      {
        path: 'cozinha',
        lazy: () =>
          import('@pages/Kitchen/Kitchen').then(({ Kitchen }) => ({
            Component: Kitchen,
          })),
      },
      {
        path: 'pedidos',
        lazy: () =>
          import('@pages/Orders/Orders').then(({ Orders }) => ({
            Component: Orders,
          })),
      },
      {
        path: 'pedidos/novo',
        lazy: () =>
          import('@pages/NewOrder/NewOrder').then(({ NewOrder }) => ({
            Component: NewOrder,
          })),
      },
      {
        path: 'pedidos/:orderId',
        lazy: () =>
          import('@pages/OrderDetail/OrderDetail').then(({ OrderDetail }) => ({
            Component: OrderDetail,
          })),
      },
      {
        path: 'catalogo',
        loader: roleGuard(MANAGERS),
        lazy: () =>
          import('@pages/Catalog/Catalog').then(({ Catalog }) => ({
            Component: Catalog,
          })),
      },
      {
        path: 'catalogo/novo',
        loader: roleGuard(MANAGERS),
        lazy: () =>
          import('@pages/NewProduct/NewProduct').then(({ NewProduct }) => ({
            Component: NewProduct,
          })),
      },
      {
        path: 'catalogo/categorias',
        loader: roleGuard(MANAGERS),
        lazy: () =>
          import('@pages/CatalogCategories/CatalogCategories').then(
            ({ CatalogCategories }) => ({
              Component: CatalogCategories,
            })
          ),
      },
      {
        path: 'catalogo/:productId',
        loader: roleGuard(MANAGERS),
        lazy: () =>
          import('@pages/ProductDetail/ProductDetail').then(
            ({ ProductDetail }) => ({
              Component: ProductDetail,
            })
          ),
      },
      {
        path: 'unidades/nova',
        loader: roleGuard(MANAGERS),
        lazy: () =>
          import('@pages/NewUnit/NewUnit').then(({ NewUnit }) => ({
            Component: NewUnit,
          })),
      },
      {
        path: 'relatorios',
        loader: roleGuard(MANAGERS),
        lazy: () =>
          import('@pages/Reports/Reports').then(({ Reports }) => ({
            Component: Reports,
          })),
      },
      {
        path: 'clientes',
        loader: roleGuard(MANAGERS),
        lazy: () =>
          import('@pages/Customers/Customers').then(({ Customers }) => ({
            Component: Customers,
          })),
      },
      {
        path: 'clientes/:customerId',
        loader: roleGuard(MANAGERS),
        lazy: () =>
          import('@pages/CustomerDetail/CustomerDetail').then(
            ({ CustomerDetail }) => ({ Component: CustomerDetail })
          ),
      },
      {
        path: 'colaboradores',
        loader: roleGuard(MANAGERS),
        lazy: () =>
          import('@pages/Employees/Employees').then(({ Employees }) => ({
            Component: Employees,
          })),
      },
      {
        path: 'colaboradores/:userId',
        loader: roleGuard(MANAGERS),
        lazy: () =>
          import('@pages/CollaboratorDetail/CollaboratorDetail').then(
            ({ CollaboratorDetail }) => ({ Component: CollaboratorDetail })
          ),
      },
      {
        path: 'perfil',
        lazy: () =>
          import('@pages/Profile/Profile').then(({ Profile }) => ({
            Component: Profile,
          })),
      },
      {
        path: 'assinatura',
        lazy: () =>
          import('@pages/Subscription/Subscription').then(
            ({ Subscription: AccountSubscription }) => ({
              Component: AccountSubscription,
            })
          ),
      },
      {
        path: 'empresa',
        loader: roleGuard(['TENANT_OWNER']),
        lazy: () =>
          import('@pages/Company/Company').then(({ Company }) => ({
            Component: Company,
          })),
      },
      {
        path: 'configuracoes',
        loader: roleGuard(MANAGERS),
        lazy: () =>
          import('@pages/Settings/Settings').then(({ Settings }) => ({
            Component: Settings,
          })),
        children: [
          { index: true, element: <Navigate to="unidade" replace /> },
          {
            path: 'unidade',
            lazy: () =>
              import('@pages/Settings/components/SettingsUnitSection/SettingsUnitSection').then(
                ({ SettingsUnitSection }) => ({
                  Component: SettingsUnitSection,
                })
              ),
          },
          {
            path: 'unidade/detalhe',
            lazy: () =>
              import('@pages/Settings/components/SettingsUnitDetailSection/SettingsUnitDetailSection').then(
                ({ SettingsUnitDetailSection }) => ({
                  Component: SettingsUnitDetailSection,
                })
              ),
          },
          {
            path: 'atendimento',
            lazy: () =>
              import('@pages/Settings/components/SettingsServiceSection/SettingsServiceSection').then(
                ({ SettingsServiceSection }) => ({
                  Component: SettingsServiceSection,
                })
              ),
          },
          {
            path: 'salao-comandas',
            lazy: () =>
              import('@pages/Settings/components/SettingsTableSection/SettingsTableSection').then(
                ({ SettingsTableSection }) => ({
                  Component: SettingsTableSection,
                })
              ),
          },
          {
            path: 'horarios',
            lazy: () =>
              import('@pages/Settings/components/SettingsHoursSection/SettingsHoursSection').then(
                ({ SettingsHoursSection }) => ({
                  Component: SettingsHoursSection,
                })
              ),
          },
          {
            path: 'entrega',
            lazy: () =>
              import('@pages/Settings/components/SettingsDeliverySection/SettingsDeliverySection').then(
                ({ SettingsDeliverySection }) => ({
                  Component: SettingsDeliverySection,
                })
              ),
          },
          {
            path: 'contato',
            lazy: () =>
              import('@pages/Settings/components/SettingsContactSection/SettingsContactSection').then(
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
