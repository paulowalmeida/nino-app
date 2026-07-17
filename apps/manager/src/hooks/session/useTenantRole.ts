import type { TenantRole } from '@custom_types/auth'

import { useCurrentTenant } from './useCurrentTenant'

/** Role the logged user holds in the tenant of the current route. */
export const useTenantRole = (): TenantRole | null =>
  useCurrentTenant()?.role ?? null
