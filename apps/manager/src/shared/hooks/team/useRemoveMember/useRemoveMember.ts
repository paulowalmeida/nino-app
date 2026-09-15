import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { CourierService } from '@shared/services/courier/courier.service'
import { StaffService } from '@shared/services/staff/staff.service'

type RemoveMemberVariables = {
  id: string
  kind: 'STAFF' | 'COURIER'
}

export const useRemoveMember = (unitId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Pessoa removida da loja',
      errorTitle: 'Não foi possível remover',
    },
    mutationFn: async ({ id, kind }: RemoveMemberVariables) => {
      if (kind === 'COURIER') {
        await CourierService.removeCourier(unitId as string, id)
        return
      }

      await StaffService.removeStaff(unitId as string, id)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.team.all(unitId ?? ''),
      })
    },
  })
}
