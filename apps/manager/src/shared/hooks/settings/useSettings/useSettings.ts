import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { SettingsService } from '@shared/services/settings/settings.service'
import type { UnitSettings } from '@shared/types/settings/unit-settings'

export const useSettings = (unitId: string | null) =>
  useQuery<UnitSettings>({
    queryKey: queryKeys.unit.settings(unitId ?? ''),
    queryFn: () => SettingsService.getSettings(unitId as string),
    enabled: !!unitId,
  })
