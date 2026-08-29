import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { PublicTenantSettings } from '@custom_types/settings/public-tenant-settings'
import { settingsService } from '@shared/services/settings/settings.service'

export const usePublicSettings = (tenantId: string | undefined) => {
  const query = useQuery<PublicTenantSettings>({
    queryKey: queryKeys.settings.byTenant(tenantId ?? ''),
    queryFn: () => settingsService.getPublic(tenantId as string),
    enabled: !!tenantId,
  })

  const settings = query.data
  const estimatedMinutes = settings
    ? settings.preparationMinutes + settings.deliveryMinutes
    : undefined

  return { ...query, settings, estimatedMinutes }
}
