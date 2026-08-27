import { api } from '@shared/services/http/http.service'
import type { PaymentMethod } from '@shared/types/order/payment-method'
import type { TenantSettings } from '@shared/types/settings/tenant-settings'
import type { UpdateTenantSettingsRequest } from '@shared/types/settings/update-tenant-settings-request'

export const SettingsService = {
  getSettings: (tenantId: string): Promise<TenantSettings> =>
    api.get<TenantSettings>(`tenants/${tenantId}/settings`),

  getAcceptedPayments: (
    tenantId: string
  ): Promise<{ acceptedPaymentMethods: PaymentMethod[] }> =>
    api.get<{ acceptedPaymentMethods: PaymentMethod[] }>(
      `tenants/${tenantId}/settings/public`
    ),

  saveSettings: (
    tenantId: string,
    data: UpdateTenantSettingsRequest
  ): Promise<TenantSettings> =>
    api.update<UpdateTenantSettingsRequest, TenantSettings>(
      `tenants/${tenantId}/settings`,
      data
    ),
}
