import { type LoaderFunctionArgs,redirect } from 'react-router'

import { HOME_OF } from '@shared/constants/roles.constants'
import { useSessionStore } from '@shared/states/session/session.state'
import type { TenantRole } from 'src/shared/types/auth/tenant-role'

/**
 * Esconder o item do menu não basta: quem digita a URL entra do mesmo
 * jeito. Este loader recusa a rota antes de renderizar e devolve a pessoa
 * para a tela inicial do papel dela.
 */
export const roleGuard =
  (allowed: TenantRole[]) =>
  async ({ params }: LoaderFunctionArgs) => {
    const user = await useSessionStore.getState().load()
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
