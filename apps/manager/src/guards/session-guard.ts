import { redirect } from 'react-router'

import { useSessionStore } from '@shared/states/session/session.state'

/** Requires a live session, without tying the route to a tenant. */
export const SessionGuard = async () => {
  const user = await useSessionStore.getState().load()
  if (!user) return redirect('/entrar')

  return null
}
