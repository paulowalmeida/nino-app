import { useMutation, useQueryClient } from '@tanstack/react-query'

import { UnitService } from '@shared/services/unit/unit.service'
import type { UnitDraft } from '@shared/types/store/unit-draft'

import { detailKey } from '../useUnitDetail/useUnitDetail'

export const useSaveUnit = (unitId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Dados da unidade salvos',
      errorTitle: 'Os dados da unidade não foram salvos',
    },
    mutationFn: (data: UnitDraft) =>
      UnitService.saveUnit(unitId as string, data),
    onSuccess: (unit) =>
      queryClient.setQueryData(detailKey(unitId ?? ''), unit),
  })
}
