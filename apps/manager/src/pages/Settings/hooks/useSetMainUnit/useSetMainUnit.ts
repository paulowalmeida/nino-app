import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { UnitService } from '@shared/services/unit/unit.service'

export const useSetMainUnit = (unitId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Unidade definida como matriz',
      errorTitle: 'Não deu pra definir a matriz',
    },
    mutationFn: (id: string) => UnitService.setMainUnit(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.unit.all(unitId ?? ''),
      })
    },
  })
}
