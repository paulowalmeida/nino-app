import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from '@nino/ds/components/Toast'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { StaffService } from '@shared/services/staff/staff.service'
import type { CreateInviteRequest } from '@shared/types/team/create-invite-request'

export const useInvite = (unitId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { silentError: true },
    mutationFn: (data: CreateInviteRequest) =>
      StaffService.sendInvite(unitId as string, data),
    onSuccess: (_response, { email }) => {
      toast.success(`Convite enviado para ${email}`)
      void queryClient.invalidateQueries({
        queryKey: queryKeys.team.all(unitId ?? ''),
      })
    },
  })
}
