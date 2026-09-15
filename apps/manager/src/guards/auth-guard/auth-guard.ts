import { type LoaderFunctionArgs, redirect } from 'react-router'

import { useSessionStore } from '@shared/states/session/session.state'

export const AuthGuard = async ({ params }: LoaderFunctionArgs) => {
  const user = await useSessionStore.getState().load()
  if (!user) return redirect('/entrar')

  const { memberships, setCurrentUnit } = useSessionStore.getState()
  const membership = memberships.find(({ unitId }) => unitId === params.unitId)
  if (!membership) return redirect('/')

  setCurrentUnit(membership.unitId)
  return null
}
