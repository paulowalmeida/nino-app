import type { Membership } from '@custom_types/auth/membership'
import type { DeliveryZone } from '@custom_types/settings/delivery-zone'
export const currentTenant = { tenantId: 'tenant-1' } as Membership

export const activeZone: DeliveryZone = {
  id: 'zone-1',
  tenantId: 'tenant-1',
  name: 'Centro',
  fee: '5.00',
  isActive: true,
}
