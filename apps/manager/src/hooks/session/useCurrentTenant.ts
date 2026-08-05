import type { Membership } from '@custom_types/auth/membership'
import { useSessionStore } from '@states/useSessionStore'

/** Membership of the tenant addressed by the current route, when known. */
export const useCurrentTenant = (): Membership | null =>
  useSessionStore(
    ({ memberships, currentTenantId }) =>
      memberships.find(({ tenantId }) => tenantId === currentTenantId) ?? null
  )
