import { redirect } from 'react-router'

import { useSessionStore } from '@shared/states/session/session.state'

export const SessionGuard = async () => {
  const user = await useSessionStore.getState().load()
  if (!user) return redirect('/entrar')

  return null
}
