import { redirect, type LoaderFunctionArgs } from 'react-router'

import { loadSession } from '@services/auth/session.service'
import { useSessionStore } from '@states/useSessionStore'

/** Exige sessão viva e vínculo com a loja da URL. */
export const AuthGuard = async ({ params }: LoaderFunctionArgs) => {
  const user = await loadSession()
  if (!user) return redirect('/entrar')

  const { memberships, setCurrentTenant } = useSessionStore.getState()
  const allowed = memberships.some(
    ({ tenantId }) => tenantId === params.tenantId
  )
  if (!allowed) return redirect('/')

  setCurrentTenant(params.tenantId ?? null)
  return null
}
