import { redirect, type LoaderFunctionArgs } from 'react-router'

import { loadSession } from '@services/auth/session.service'
import { useSessionStore } from '@states/useSessionStore'

/**
 * Guards the `/:tenantId` group: requires a live session and a membership in
 * the tenant addressed by the URL.
 *
 * The membership check is inert while the API does not expose the caller's own
 * memberships — `memberships` is always empty, so any tenant id passes. Drop
 * the length check once `/auth/me` returns them.
 */
export const AuthGuard = async ({ params }: LoaderFunctionArgs) => {
  const user = await loadSession()
  if (!user) return redirect('/entrar')

  const { memberships, setCurrentTenant } = useSessionStore.getState()
  const allowed = memberships.some(({ tenantId }) => tenantId === params.tenantId)
  if (memberships.length > 0 && !allowed) return redirect('/')

  setCurrentTenant(params.tenantId ?? null)
  return null
}
