import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import { updateStaffEmail } from '@services/team/team.service'

export const useUpdateStaffEmail = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, email }: { userId: string; email: string }) =>
      updateStaffEmail(tenantId as string, userId, email),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.team.all(tenantId ?? ''),
      })
    },
  })
}
