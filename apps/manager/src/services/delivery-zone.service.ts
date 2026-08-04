import type { Page } from '@custom_types/http/page';
import type { DeliveryZone } from '@custom_types/settings';
import { api } from '@services/http.service';

export const DeliveryZoneService = {
  listDeliveryZones: (tenantId: string): Promise<Page<DeliveryZone>> =>
    api.get<Page<DeliveryZone>>(`tenants/${tenantId}/delivery-zones`),

  createDeliveryZone: (
    tenantId: string,
    data: { name: string; fee: number }
  ): Promise<DeliveryZone> =>
    api.create<typeof data, DeliveryZone>(
      `tenants/${tenantId}/delivery-zones`,
      data
    ),

  updateDeliveryZone: (
    tenantId: string,
    id: string,
    data: { name?: string; fee?: number; isActive?: boolean }
  ): Promise<DeliveryZone> =>
    api.patch<typeof data, DeliveryZone>(
      `tenants/${tenantId}/delivery-zones`,
      id,
      data
    ),

  removeDeliveryZone: (
    tenantId: string,
    id: string
  ): Promise<{ message: string }> =>
    api.remove<{ message: string }>(`tenants/${tenantId}/delivery-zones`, id),
}
