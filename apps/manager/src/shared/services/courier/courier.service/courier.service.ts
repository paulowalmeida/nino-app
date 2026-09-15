import { api } from '@shared/services/http/http.service'
import type { CourierPage } from '@shared/types/team/courier-page'

export const CourierService = {
  listCouriers: (unitId: string): Promise<CourierPage> =>
    api.get<CourierPage>('units/' + unitId + '/couriers'),

  removeCourier: (unitId: string, courierId: string): Promise<void> =>
    api.remove<void>(`units/${unitId}/couriers/${courierId}`),
}
