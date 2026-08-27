import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { StaffService } from '@shared/services/staff/staff.service'

type RemoveMemberVariables = {
  id: string
  kind: 'STAFF' | 'COURIER'
}

export const useRemoveMember = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Pessoa removida da loja',
      errorTitle: 'Não foi possível remover',
    },
    mutationFn: ({ id }: RemoveMemberVariables) =>
      StaffService.removeStaff(tenantId as string, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.team.all(tenantId ?? ''),
      })
    },
  })
}
