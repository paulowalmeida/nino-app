import type { Membership } from '@custom_types/auth/membership'
import type { OpeningHours } from '@custom_types/settings/opening-hours'
export const currentTenant = { tenantId: 'tenant-1' } as Membership

export const sundayHours: OpeningHours = {
  id: 'hours-1',
  tenantId: 'tenant-1',
  dayOfWeek: 0,
  openTime: '18:00',
  closeTime: '23:00',
  isOpen: true,
}
