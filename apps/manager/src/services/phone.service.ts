import type { Page } from '@custom_types/http/page'
import type { TenantPhone } from '@custom_types/settings/tenant-phone'
import { api } from '@services/http.service'

export const PhoneService = {
  listPhones: (tenantId: string): Promise<Page<TenantPhone>> =>
    api.get<Page<TenantPhone>>(`tenants/${tenantId}/phones`),

  createPhone: (tenantId: string, phone: string): Promise<TenantPhone> =>
    api.create<{ phone: string }, TenantPhone>(`tenants/${tenantId}/phones`, {
      phone,
    }),

  updatePhone: (
    tenantId: string,
    id: string,
    phone: string
  ): Promise<TenantPhone> =>
    api.patch<{ phone: string }, TenantPhone>(
      `tenants/${tenantId}/phones/${id}`,
      { phone }
    ),

  removePhone: (tenantId: string, id: string): Promise<{ message: string }> =>
    api.remove<{ message: string }>(`tenants/${tenantId}/phones/${id}`),
}
