import { api } from '@shared/services/http/http.service'
import type { Page } from '@shared/types/http/page'
import type { OpeningHours } from '@shared/types/settings/opening-hours'

export const OpeningHoursService = {
  listOpeningHours: (unitId: string): Promise<Page<OpeningHours>> =>
    api.get<Page<OpeningHours>>(`units/${unitId}/opening-hours`),
  createOpeningHours: (
    unitId: string,
    data: {
      dayOfWeek: number
      openTime: string
      closeTime: string
      isOpen: boolean
    }
  ): Promise<OpeningHours> =>
    api.create(`units/${unitId}/opening-hours`, data),
  updateOpeningHours: (
    unitId: string,
    id: string,
    data: { openTime?: string; closeTime?: string; isOpen?: boolean }
  ): Promise<OpeningHours> =>
    api.patch(`units/${unitId}/opening-hours/${id}`, data),
  removeOpeningHours: (
    unitId: string,
    id: string
  ): Promise<{ message: string }> =>
    api.remove(`units/${unitId}/opening-hours/${id}`),
}
