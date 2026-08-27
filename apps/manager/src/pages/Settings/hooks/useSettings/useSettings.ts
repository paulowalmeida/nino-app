import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { SettingsService } from '@shared/services/settings/settings.service'
import type { TenantSettings } from '@shared/types/settings/tenant-settings'

export const useSettings = (tenantId: string | null) =>
  useQuery<TenantSettings>({
    queryKey: queryKeys.tenant.settings(tenantId ?? ''),
    queryFn: () => SettingsService.getSettings(tenantId as string),
    enabled: !!tenantId,
  })
