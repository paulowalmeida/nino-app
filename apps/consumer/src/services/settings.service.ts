import type { PublicTenantSettings } from '@custom_types/settings/public-tenant-settings'
import { api } from '@services/http.service'

export const getPublicSettings = (
  tenantId: string
): Promise<PublicTenantSettings> =>
  api.get<PublicTenantSettings>(`tenants/${tenantId}/settings/public`)
