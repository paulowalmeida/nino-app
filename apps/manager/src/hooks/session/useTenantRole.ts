import type { TenantRole } from '@custom_types/auth/tenant-role'
import { useCurrentTenant } from './useCurrentTenant'

/** Role the logged user holds in the tenant of the current route. */
export const useTenantRole = (): TenantRole | null =>
  useCurrentTenant()?.role ?? null
