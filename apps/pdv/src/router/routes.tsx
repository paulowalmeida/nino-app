import { createBrowserRouter } from 'react-router'

import { Counter } from '@pages/counter'
import { Login } from '@pages/login'

import { AuthGuard } from './auth-guard'
import { RootLoader } from './root-loader'

/**
 * O caixa tem uma tela só. Entrar já é escolher a loja: quem opera atende
 * de um balcão, não administra a rede.
 */
export const router = createBrowserRouter([
  { path: '/', loader: RootLoader },
  { path: '/entrar', element: <Login /> },
  {
    path: '/:tenantId',
    element: <Counter />,
    loader: AuthGuard,
  },
])
