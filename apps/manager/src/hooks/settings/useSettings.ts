import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { TenantSettings } from '@custom_types/settings'
import { SettingsService } from '@services/settings.service'

export const useSettings = (tenantId: string | null) =>
  useQuery<TenantSettings>({
    queryKey: queryKeys.tenant.settings(tenantId ?? ''),
    queryFn: () => SettingsService.getSettings(tenantId as string),
    enabled: !!tenantId,
  })
