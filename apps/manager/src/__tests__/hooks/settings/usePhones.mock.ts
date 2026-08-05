import type { Page } from '@custom_types/http/page'
import type { TenantPhone } from '@custom_types/settings/tenant-phone'
export const phonesPage: Page<TenantPhone> = {
  data: [{ id: 'phone-1', tenantId: 'tenant-1', phone: '85999990000' }],
  pagination: { total: 1 },
}
