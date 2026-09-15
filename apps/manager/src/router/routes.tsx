import { createBrowserRouter, Navigate } from 'react-router'

import { RootLoader } from '@loaders/root-loader/root-loader'

import { AuthGuard } from '@guards/auth-guard/auth-guard'
import { FirstStoreGuard } from '@guards/first-store-guard/first-store-guard'
import { GuestGuard } from '@guards/guest-guard/guest-guard'
import { roleGuard } from '@guards/role-guard/role-guard'
import { SessionGuard } from '@guards/session-guard/session-guard'
import { AppLayout } from '@layouts/AppLayout/AppLayout'
import { AuthLayout } from '@layouts/AuthLayout/AuthLayout'
import { RegisterLayout } from '@layouts/RegisterLayout/RegisterLayout'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { RouteErrorBoundary } from '@shared/components/RouteErrorBoundary/RouteErrorBoundary'
import { UNIT_MANAGER_ROLES } from '@shared/constants/roles.constants'

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
      {
        path: '/esqueci-senha',
        loader: GuestGuard,
        lazy: () =>
          import('@pages/ForgotPassword/ForgotPassword').then(
            ({ ForgotPassword }) => ({ Component: ForgotPassword })
          ),
      },
      {
        path: '/redefinir-senha',
        lazy: () =>
          import('@pages/ResetPassword/ResetPassword').then(
            ({ ResetPassword }) => ({ Component: ResetPassword })
          ),
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
    path: '/:unitId',
    loader: AuthGuard,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: 'visao-geral',
        loader: roleGuard(UNIT_MANAGER_ROLES),
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
        path: 'produtos',
        loader: roleGuard(UNIT_MANAGER_ROLES),
        lazy: () =>
          import('@pages/Catalog/Catalog').then(({ Catalog }) => ({
            Component: Catalog,
          })),
      },
      {
        path: 'produtos/novo',
        loader: roleGuard(UNIT_MANAGER_ROLES),
        lazy: () =>
          import('@pages/NewProduct/NewProduct').then(({ NewProduct }) => ({
            Component: NewProduct,
          })),
      },
      {
        path: 'categorias-produtos',
        loader: roleGuard(UNIT_MANAGER_ROLES),
        lazy: () =>
          import('@pages/CatalogCategories/CatalogCategories').then(
            ({ CatalogCategories }) => ({
              Component: CatalogCategories,
            })
          ),
      },
      {
        path: 'produtos/:productId',
        loader: roleGuard(UNIT_MANAGER_ROLES),
        lazy: () =>
          import('@pages/ProductDetail/ProductDetail').then(
            ({ ProductDetail }) => ({
              Component: ProductDetail,
            })
          ),
      },
      {
        path: 'relatorios',
        loader: roleGuard(UNIT_MANAGER_ROLES),
        lazy: () =>
          import('@pages/Reports/Reports').then(({ Reports }) => ({
            Component: Reports,
          })),
      },
      {
        path: 'clientes',
        loader: roleGuard(UNIT_MANAGER_ROLES),
        lazy: () =>
          import('@pages/Consumers/Consumers').then(({ Consumers }) => ({
            Component: Consumers,
          })),
      },
      {
        path: 'clientes/:consumerId',
        loader: roleGuard(UNIT_MANAGER_ROLES),
        lazy: () =>
          import('@pages/ConsumerDetail/ConsumerDetail').then(
            ({ ConsumerDetail }) => ({ Component: ConsumerDetail })
          ),
      },
      {
        path: 'colaboradores',
        loader: roleGuard(UNIT_MANAGER_ROLES),
        lazy: () =>
          import('@pages/Employees/Employees').then(({ Employees }) => ({
            Component: Employees,
          })),
      },
      {
        path: 'colaboradores/:userId',
        loader: roleGuard(UNIT_MANAGER_ROLES),
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
        loader: roleGuard(['UNIT_OWNER']),
        lazy: () =>
          import('@pages/Subscription/Subscription').then(
            ({ Subscription }) => ({ Component: Subscription })
          ),
      },
      {
        path: 'empresa',
        element: <Navigate to="informacoes" replace />,
      },
      {
        path: 'empresa/informacoes',
        loader: roleGuard(['UNIT_OWNER']),
        lazy: () =>
          import('@pages/Company/Company').then(({ Company }) => ({
            Component: Company,
          })),
      },
      {
        path: 'empresa/unidades',
        loader: roleGuard(UNIT_MANAGER_ROLES),
        lazy: () =>
          import('@pages/Units/SettingsUnitSection/SettingsUnitSection').then(
            ({ SettingsUnitSection }) => ({ Component: SettingsUnitSection })
          ),
      },
      {
        path: 'empresa/unidades/nova',
        loader: roleGuard(['UNIT_OWNER']),
        lazy: () =>
          import('@pages/NewUnit/NewUnit').then(({ NewUnit }) => ({
            Component: NewUnit,
          })),
      },
      {
        path: 'empresa/personalizar',
        loader: roleGuard(['UNIT_OWNER']),
        lazy: () =>
          import('@pages/Units/Personalize/Personalize').then(
            ({ Personalize }) => ({ Component: Personalize })
          ),
      },
      {
        path: 'unidade',
        loader: roleGuard(UNIT_MANAGER_ROLES),
        lazy: () =>
          import('@pages/Settings/Settings').then(({ Settings }) => ({
            Component: Settings,
          })),
        children: [
          { index: true, element: <Navigate to="informacoes" replace /> },
          {
            path: 'detalhe',
            element: <Navigate to="../informacoes" replace />,
          },
          {
            path: 'informacoes',
            lazy: () =>
              import('@pages/Units/SettingsUnitDetailSection/SettingsUnitDetailSection').then(
                ({ SettingsUnitDetailSection }) => ({
                  Component: SettingsUnitDetailSection,
                })
              ),
          },
          {
            path: 'horarios',
            lazy: () =>
              import('@pages/Units/UnitHours/UnitHours').then(
                ({ UnitHours }) => ({ Component: UnitHours })
              ),
          },
          {
            path: 'cashback',
            lazy: () =>
              import('@pages/Units/UnitCashback/UnitCashback').then(
                ({ UnitCashback }) => ({ Component: UnitCashback })
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
            path: 'entrega',
            lazy: () =>
              import('@pages/Settings/components/SettingsDeliverySection/SettingsDeliverySection').then(
                ({ SettingsDeliverySection }) => ({
                  Component: SettingsDeliverySection,
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
            path: 'contato',
            lazy: () =>
              import('@pages/Settings/components/SettingsContactSection/SettingsContactSection').then(
                ({ SettingsContactSection }) => ({
                  Component: SettingsContactSection,
                })
              ),
          },
          {
            path: 'unidades',
            element: <Navigate to="../empresa/unidades" replace />,
          },
          {
            path: 'nova',
            element: <Navigate to="../../empresa/unidades/nova" replace />,
          },
        ],
      },
      {
        path: 'configuracoes',
        children: [
          { index: true, element: <Navigate to="../unidade" replace /> },
          {
            path: 'unidade',
            element: <Navigate to="../../empresa/unidades" replace />,
          },
          {
            path: 'unidade/detalhe',
            element: <Navigate to="../../unidade/informacoes" replace />,
          },
          {
            path: 'atendimento',
            element: <Navigate to="../../unidade/atendimento" replace />,
          },
          {
            path: 'salao-comandas',
            element: <Navigate to="../../unidade/salao-comandas" replace />,
          },
          {
            path: 'horarios',
            element: <Navigate to="../../unidade/horarios" replace />,
          },
          {
            path: 'entrega',
            element: <Navigate to="../../unidade/entrega" replace />,
          },
          {
            path: 'contato',
            element: <Navigate to="../../unidade/contato" replace />,
          },
        ],
      },
      {
        path: 'unidades',
        element: <Navigate to="../empresa/unidades" replace />,
      },
      {
        path: 'unidades/detalhe',
        element: <Navigate to="../unidade/informacoes" replace />,
      },
      {
        path: 'unidades/nova',
        element: <Navigate to="../empresa/unidades/nova" replace />,
      },
      {
        path: 'personalizar',
        element: <Navigate to="../empresa/personalizar" replace />,
      },
    ],
  },
])
