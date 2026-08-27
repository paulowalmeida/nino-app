import { type LoaderFunctionArgs,redirect } from 'react-router'

import { useSessionStore } from '@shared/states/session/session.state'

/**
 * Guards the `/:tenantId` group: requires a live session and a membership in
 * the tenant addressed by the URL.
 */
export const AuthGuard = async ({ params }: LoaderFunctionArgs) => {
  const user = await useSessionStore.getState().load()
  if (!user) return redirect('/entrar')

  const { memberships, setCurrentTenant } = useSessionStore.getState()
  const allowed = memberships.some(
    ({ tenantId }) => tenantId === params.tenantId
  )
  if (!allowed) return redirect('/')

  setCurrentTenant(params.tenantId ?? null)
  return null
}
