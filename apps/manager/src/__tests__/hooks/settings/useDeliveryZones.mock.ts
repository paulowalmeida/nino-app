import type { Page } from '@custom_types/http/page'
import type { DeliveryZone } from '@custom_types/settings'

export const zonesPage: Page<DeliveryZone> = {
  data: [
    {
      id: 'zone-1',
      tenantId: 'tenant-1',
      name: 'Centro',
      fee: '5.00',
      isActive: true,
    },
  ],
  pagination: { total: 1 },
}
