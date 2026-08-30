import { Navigate, Outlet, useLocation, useParams } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { useCustomerSession } from '@shared/hooks/useCustomerSession/useCustomerSession'

export const AuthenticatedLayout = () => {
  const { slug } = useParams()
  const location = useLocation()
  const { customer, isPending } = useCustomerSession()

  if (isPending) {
    return (
      <Box
        aria-busy="true"
        aria-label="Validando a sessão"
        className="min-h-dvh"
      />
    )
  }

  if (!customer) {
    const signIn = slug ? `/${slug}/entrar` : '/entrar'
    const returnTo = `${location.pathname}${location.search}${location.hash}`

    return <Navigate to={signIn} replace state={{ returnTo }} />
  }

  return <Outlet />
}
