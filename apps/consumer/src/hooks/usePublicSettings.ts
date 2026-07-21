import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { PublicTenantSettings } from '@custom_types/settings/public-tenant-settings'
import { getPublicSettings } from '@services/settings/settings.service'

export const usePublicSettings = (tenantId: string | undefined) => {
  const query = useQuery<PublicTenantSettings>({
    queryKey: queryKeys.settings.byTenant(tenantId ?? ''),
    queryFn: () => getPublicSettings(tenantId as string),
    enabled: !!tenantId,
  })

  return { ...query, settings: query.data }
}
