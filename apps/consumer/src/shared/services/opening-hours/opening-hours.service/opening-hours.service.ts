import type { PublicOpeningHours } from '@custom_types/opening-hours/public-opening-hours'
import { api } from '@shared/services/http/http.service'

export const openingHoursService = {
  getPublic: (tenantId: string): Promise<PublicOpeningHours[]> =>
    api.get<PublicOpeningHours[]>(`tenants/${tenantId}/opening-hours/public`),
}
