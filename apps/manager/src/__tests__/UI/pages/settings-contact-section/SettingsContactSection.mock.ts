import type { Membership } from '@custom_types/auth/membership'
import type { TenantPhone } from '@custom_types/settings/tenant-phone'
export const currentTenant = { tenantId: 'tenant-1' } as Membership

export const phones: TenantPhone[] = [
  { id: 'phone-1', tenantId: 'tenant-1', phone: '+5585999998888' },
  { id: 'phone-2', tenantId: 'tenant-1', phone: '+5585988887777' },
]
