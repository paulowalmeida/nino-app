import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { CreateInviteRequest } from '@custom_types/team'
import { StaffService } from '@services/staff.service'

export const useInvite = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    /* The form already shows success/error inline below the field. */
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
