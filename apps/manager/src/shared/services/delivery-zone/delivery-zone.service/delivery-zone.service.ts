import { api } from '@shared/services/http/http.service'
import type { Page } from '@shared/types/http/page'
import type { DeliveryZone } from '@shared/types/settings/delivery-zone'

export const DeliveryZoneService = {
  listDeliveryZones: (unitId: string): Promise<Page<DeliveryZone>> =>
    api.get<Page<DeliveryZone>>(`units/${unitId}/delivery-zones`),

  createDeliveryZone: (
    unitId: string,
    data: {
      maxRadiusKm: number
      fee: number
      freeDeliveryEnabled?: boolean
      freeDeliveryMinOrder?: number | null
    }
  ): Promise<DeliveryZone> =>
    api.create<typeof data, DeliveryZone>(
      `units/${unitId}/delivery-zones`,
      data
    ),

  updateDeliveryZone: (
    unitId: string,
    id: string,
    data: {
      maxRadiusKm?: number
      fee?: number
      isActive?: boolean
      freeDeliveryEnabled?: boolean
      freeDeliveryMinOrder?: number | null
    }
  ): Promise<DeliveryZone> =>
    api.patch<typeof data, DeliveryZone>(
      `units/${unitId}/delivery-zones/${id}`,
      data
    ),

  removeDeliveryZone: (
    unitId: string,
    id: string
  ): Promise<{ message: string }> =>
    api.remove<{ message: string }>(`units/${unitId}/delivery-zones/${id}`),
}
