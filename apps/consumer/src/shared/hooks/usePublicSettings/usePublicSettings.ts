import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { PublicUnitSettings } from '@custom_types/settings/public-unit-settings'
import { settingsService } from '@shared/services/settings/settings.service'

export const usePublicSettings = (unitId: string | undefined) => {
  const query = useQuery<PublicUnitSettings>({
    queryKey: queryKeys.settings.byUnit(unitId ?? ''),
    queryFn: () => settingsService.getPublic(unitId as string),
    enabled: !!unitId,
  })

  const settings = query.data
  const estimatedMinutes = settings
    ? settings.preparationMinutes + settings.deliveryMinutes
    : undefined

  return { ...query, settings, estimatedMinutes }
}
