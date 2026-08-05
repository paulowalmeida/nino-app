import type { Page } from '@custom_types/http/page'
import type { OpeningHours } from '@custom_types/settings/opening-hours'
export const mondayHoursPage: Page<OpeningHours> = {
  data: [
    {
      id: 'hours-1',
      tenantId: 'tenant-1',
      dayOfWeek: 1,
      openTime: '08:00',
      closeTime: '18:00',
      isOpen: true,
    },
  ],
  pagination: { total: 1 },
}
