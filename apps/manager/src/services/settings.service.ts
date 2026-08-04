import type { PaymentMethod } from '@custom_types/order'
import type {
  TenantSettings,
  UpdateTenantSettingsRequest,
} from '@custom_types/settings'
import { api } from '@services/http.service'

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
      `tenants/${tenantId}`,
      'settings',
      data
    ),
}
