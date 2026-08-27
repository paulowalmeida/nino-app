import { api } from '@shared/services/http/http.service'
import type { Page } from '@shared/types/http/page'
import type { OpeningHours } from '@shared/types/settings/opening-hours'

export const OpeningHoursService = {
  listOpeningHours: (tenantId: string): Promise<Page<OpeningHours>> =>
    api.get<Page<OpeningHours>>(`tenants/${tenantId}/opening-hours`),

  createOpeningHours: (
    tenantId: string,
    data: {
      dayOfWeek: number
      openTime: string
      closeTime: string
      isOpen: boolean
    }
  ): Promise<OpeningHours> =>
    api.create<typeof data, OpeningHours>(
      `tenants/${tenantId}/opening-hours`,
      data
    ),

  updateOpeningHours: (
    tenantId: string,
    id: string,
    data: { openTime?: string; closeTime?: string; isOpen?: boolean }
  ): Promise<OpeningHours> =>
    api.patch<typeof data, OpeningHours>(
      `tenants/${tenantId}/opening-hours/${id}`,
      data
    ),

  removeOpeningHours: (
    tenantId: string,
    id: string
  ): Promise<{ message: string }> =>
    api.remove<{ message: string }>(
      `tenants/${tenantId}/opening-hours/${id}`
    ),
}
