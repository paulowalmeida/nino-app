import type { PublicOpeningHours } from '@custom_types/opening-hours/public-opening-hours'
import { api } from '@shared/services/http/http.service'

export const openingHoursService = {
  getPublic: (unitId: string): Promise<PublicOpeningHours[]> =>
    api.get<PublicOpeningHours[]>(`units/${unitId}/opening-hours/public`),
}
