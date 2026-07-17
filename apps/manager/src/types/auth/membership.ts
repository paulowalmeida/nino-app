import type { TenantRole } from './tenant-role'

export type Membership = {
  tenantId: string
  tenantName: string
  tenantSlug: string
  role: TenantRole
  isCurrent: boolean
}
