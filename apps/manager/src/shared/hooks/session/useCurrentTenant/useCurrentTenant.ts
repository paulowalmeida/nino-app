import { useSessionStore } from '@shared/states/session/session.state'
import type { Membership } from '@shared/types/auth/membership'

/** Membership of the tenant addressed by the current route, when known. */
export const useCurrentTenant = (): Membership | null =>
  useSessionStore(
    ({ memberships, currentTenantId }) =>
      memberships.find(({ tenantId }) => tenantId === currentTenantId) ?? null
  )
