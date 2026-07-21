import type { PublicTenantSettings } from '@custom_types/settings/public-tenant-settings'
import { get } from '@services/api/api.service'

export const getPublicSettings = (
  tenantId: string
): Promise<PublicTenantSettings> =>
  get<PublicTenantSettings>(`tenants/${tenantId}/settings/public`)
