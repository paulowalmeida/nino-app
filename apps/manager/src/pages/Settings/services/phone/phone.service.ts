import { api } from '@shared/services/http/http.service'
import type { Page } from '@shared/types/http/page'
import type { UnitPhone } from '@shared/types/settings/unit-phone'

export const PhoneService = {
  listPhones: (unitId: string): Promise<Page<UnitPhone>> =>
    api.get<Page<UnitPhone>>(`units/${unitId}/phones`),

  createPhone: (unitId: string, phone: string): Promise<UnitPhone> =>
    api.create<{ phone: string }, UnitPhone>(`units/${unitId}/phones`, {
      phone,
    }),

  updatePhone: (
    unitId: string,
    id: string,
    phone: string
  ): Promise<UnitPhone> =>
    api.patch<{ phone: string }, UnitPhone>(`units/${unitId}/phones/${id}`, {
      phone,
    }),

  removePhone: (unitId: string, id: string): Promise<{ message: string }> =>
    api.remove<{ message: string }>(`units/${unitId}/phones/${id}`),
}
