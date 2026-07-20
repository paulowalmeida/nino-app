import { redirect } from 'react-router'

import type { Membership } from '@custom_types/auth'
import { loadSession } from '@services/auth/session.service'
import { useSessionStore } from '@states/useSessionStore'

const entryTenant = (memberships: Membership[]): string => {
  const current = memberships.find(({ isCurrent }) => isCurrent)
  return (current ?? memberships[0]).tenantId
}

/**
 * O caixa abre direto na loja: quem opera atende um balcão só. Sem loja
 * vinculada não há o que operar — o cadastro acontece no gestor.
 */
export const RootLoader = async () => {
  const user = await loadSession()
  if (!user) return redirect('/entrar')

  const { memberships } = useSessionStore.getState()
  if (memberships.length === 0) return redirect('/entrar')

  return redirect(`/${entryTenant(memberships)}`)
}
