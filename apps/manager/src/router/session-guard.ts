import { redirect } from 'react-router'

import { loadSession } from '@services/auth/session.service'

/** Requires a live session, without tying the route to a tenant. */
export const SessionGuard = async () => {
  const user = await loadSession()
  if (!user) return redirect('/entrar')

  return null
}
