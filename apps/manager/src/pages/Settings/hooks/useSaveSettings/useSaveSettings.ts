import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { SettingsService } from '@shared/services/settings/settings.service'
import type { UpdateUnitSettingsRequest } from '@shared/types/settings/update-unit-settings-request'

export const useSaveSettings = (unitId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Atendimento salvo',
      errorTitle: 'O atendimento não foi salvo',
    },
    mutationFn: (data: UpdateUnitSettingsRequest) =>
      SettingsService.saveSettings(unitId as string, data),
    onSuccess: (settings) => {
      queryClient.setQueryData(
        queryKeys.unit.settings(unitId ?? ''),
        settings
      )
      void queryClient.invalidateQueries({
        queryKey: queryKeys.unit.publicSettings(unitId ?? ''),
      })
    },
  })
}
