import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { SettingsService } from '@shared/services/settings/settings.service'
import type { UpdateUnitSettingsRequest } from '@shared/types/settings/update-unit-settings-request.type'

/* WHY: a taxa divide o recurso com as outras configurações da unidade, então
 * a chamada leva o retrato inteiro; mandar só os campos do formulário apagaria
 * o que as outras telas gravaram. */
export const useSaveServiceFee = (unitId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Taxa de serviço salva',
      errorTitle: 'A taxa de serviço não foi salva',
    },
    mutationFn: (data: UpdateUnitSettingsRequest) =>
      SettingsService.saveSettings(unitId as string, data),
    onSuccess: (settings) => {
      queryClient.setQueryData(queryKeys.unit.settings(unitId ?? ''), settings)
      void queryClient.invalidateQueries({
        queryKey: queryKeys.unit.publicSettings(unitId ?? ''),
      })
    },
  })
}
