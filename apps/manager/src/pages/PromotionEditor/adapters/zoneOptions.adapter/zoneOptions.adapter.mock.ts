import type { DeliveryZone } from '@shared/types/settings/delivery-zone'

const zoneDefaults = { freeDeliveryEnabled: false, freeDeliveryMinOrder: null }

export const deliveryZonesMock: DeliveryZone[] = [
  {
    ...zoneDefaults,
    id: 'zone-1',
    minRadiusKm: 0,
    maxRadiusKm: 3,
    fee: 5,
    isActive: true,
  },
  {
    ...zoneDefaults,
    id: 'zone-2',
    minRadiusKm: 3,
    maxRadiusKm: 6.5,
    fee: 9,
    isActive: true,
  },
  {
    ...zoneDefaults,
    id: 'zone-3',
    minRadiusKm: 6.5,
    maxRadiusKm: 10,
    fee: 14,
    isActive: false,
  },
]
