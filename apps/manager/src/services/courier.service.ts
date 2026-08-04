import type { CourierPage } from '@custom_types/team'
import { api } from '@services/http.service'

export const CourierService = {
  listCouriers: (tenantId: string): Promise<CourierPage> =>
    api.get<CourierPage>(`tenants/${tenantId}/couriers`),

  removeCourier: (
    tenantId: string,
    courierId: string
  ): Promise<{ message: string }> =>
    api.remove<{ message: string }>(
      `tenants/${tenantId}/couriers`,
      courierId
    ),
}
