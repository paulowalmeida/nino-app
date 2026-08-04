import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import { StaffService } from '@services/staff.service'

export const useUpdateStaffEmail = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    /* The modal closes on success and shows errors inline — only
     * success becomes a toast. */
    meta: { success: 'E-mail de login atualizado', silentError: true },
    mutationFn: ({ userId, email }: { userId: string; email: string }) =>
      StaffService.updateStaffEmail(tenantId as string, userId, email),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.team.all(tenantId ?? ''),
      })
    },
  })
}
