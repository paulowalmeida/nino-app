import { redirect } from 'react-router'

import { loadSession } from '@services/auth/session.service'
import { useSessionStore } from '@states/useSessionStore'

/**
 * Entry point: sends the merchant where their memberships say they belong.
 *
 * Until the API exposes memberships every session lands on the first-store
 * onboarding, since the list is always empty.
 */
export const RootLoader = async () => {
  const user = await loadSession()
  if (!user) return redirect('/entrar')

  const { memberships } = useSessionStore.getState()
  if (memberships.length === 0) return redirect('/primeira-loja')
  if (memberships.length === 1) {
    return redirect(`/${memberships[0].tenantId}/visao-geral`)
  }

  return redirect('/lojas')
}
