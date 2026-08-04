import type { DeliveryZone } from '@custom_types/settings'

export const activeZone: DeliveryZone = {
  id: 'zone-1',
  tenantId: 'tenant-1',
  name: 'Centro',
  fee: '5.00',
  isActive: true,
}

export const pausedZone: DeliveryZone = {
  id: 'zone-2',
  tenantId: 'tenant-1',
  name: 'Zona Norte',
  fee: '8.50',
  isActive: false,
}
