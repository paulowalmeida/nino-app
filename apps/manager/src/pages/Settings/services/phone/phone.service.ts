import { api } from '@shared/services/http/http.service'
import type { Page } from '@shared/types/http/page'
import type { TenantPhone } from '@shared/types/settings/tenant-phone'

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
