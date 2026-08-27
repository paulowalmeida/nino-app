import { api } from '@shared/services/http/http.service'
import type { CourierPage } from '@shared/types/team/courier-page'

export const CourierService = {
  listCouriers: (tenantId: string): Promise<CourierPage> =>
    api.get<CourierPage>('tenants/' + tenantId + '/couriers'),
}
