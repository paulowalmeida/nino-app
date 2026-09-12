import { Navigate, Outlet, useLocation, useParams } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { useConsumerSession } from '@shared/hooks/useConsumerSession/useConsumerSession'

export const AuthenticatedLayout = () => {
  const { slug } = useParams()
  const location = useLocation()
  const { consumer, isPending } = useConsumerSession()

  if (isPending) {
    return (
      <Box
        aria-busy="true"
        aria-label="Validando a sessão"
        className="min-h-dvh"
      />
    )
  }

  if (!consumer) {
    const signIn = slug ? `/${slug}/entrar` : '/entrar'
    const returnTo = `${location.pathname}${location.search}${location.hash}`

    return <Navigate to={signIn} replace state={{ returnTo }} />
  }

  return <Outlet />
}
