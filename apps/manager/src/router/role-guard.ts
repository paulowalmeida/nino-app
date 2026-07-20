import { redirect, type LoaderFunctionArgs } from 'react-router'

import { HOME_OF } from '@constants/roles'
import type { TenantRole } from '@custom_types/auth'
import { loadSession } from '@services/auth/session.service'
import { useSessionStore } from '@states/useSessionStore'

/**
 * Esconder o item do menu não basta: quem digita a URL entra do mesmo
 * jeito. Este loader recusa a rota antes de renderizar e devolve a pessoa
 * para a tela inicial do papel dela.
 */
export const roleGuard =
  (allowed: TenantRole[]) =>
  async ({ params }: LoaderFunctionArgs) => {
    const user = await loadSession()
    if (!user) return redirect('/entrar')

    const { memberships, setCurrentTenant } = useSessionStore.getState()
    const membership = memberships.find(
      ({ tenantId }) => tenantId === params.tenantId
    )
    if (!membership) return redirect('/')

    if (!allowed.includes(membership.role)) {
      return redirect(`/${params.tenantId}/${HOME_OF[membership.role]}`)
    }

    setCurrentTenant(params.tenantId ?? null)
    return null
  }
