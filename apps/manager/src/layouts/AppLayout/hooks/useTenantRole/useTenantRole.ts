import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'
import type { TenantRole } from '@shared/types/auth/tenant-role'

/** Role the logged user holds in the tenant of the current route. */
export const useTenantRole = (): TenantRole | null =>
  useCurrentTenant()?.role ?? null
