import { redirect } from 'react-router'

import { useSessionStore } from '@shared/states/session/session.state'

export const FirstStoreGuard = async () => {
  const user = await useSessionStore.getState().load()
  if (!user) return redirect('/entrar')

  const { memberships } = useSessionStore.getState()
  if (memberships.length > 0) return redirect('/')

  return null
}
