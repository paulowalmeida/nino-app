import type { TenantRole } from './tenant-role'

/**
 * `companyId` separates switching unit (same company) from choosing a
 * restaurant (different companies) — Company is the brand, Tenant is the unit.
 */
export type Membership = {
  tenantId: string
  tenantName: string
  tenantSlug: string
  companyId: string
  companyName: string
  role: TenantRole
  isCurrent: boolean
}
