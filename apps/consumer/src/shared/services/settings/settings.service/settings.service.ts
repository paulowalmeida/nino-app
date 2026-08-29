import type { PublicTenantSettings } from '@custom_types/settings/public-tenant-settings'
import { api } from '@shared/services/http/http.service'

export const settingsService = {
  getPublic: (tenantId: string): Promise<PublicTenantSettings> =>
    api.get<PublicTenantSettings>(`tenants/${tenantId}/settings/public`),
}
