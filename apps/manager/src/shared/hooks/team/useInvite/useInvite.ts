import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { StaffService } from '@shared/services/staff/staff.service'
import type { CreateInviteRequest } from '@shared/types/team/create-invite-request'

export const useInvite = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
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
