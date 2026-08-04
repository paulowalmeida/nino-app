import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { CreateInviteRequest } from '@custom_types/team'
import { StaffService } from '@services/staff.service'

export const useInvite = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    /* O formulário já confirma e erra na linha de baixo do campo. */
    meta: { silentError: true },
    mutationFn: (data: CreateInviteRequest) =>
      StaffService.sendInvite(tenantId as string, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.team.all(tenantId ?? ''),
      })
    },
  })
}
