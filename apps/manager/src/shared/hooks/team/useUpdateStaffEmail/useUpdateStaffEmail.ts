import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { StaffService } from '@shared/services/staff/staff.service'

type UpdateStaffEmailVariables = {
  userId: string
  email: string
}

export const useUpdateStaffEmail = (unitId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'E-mail alterado',
      errorTitle: 'O e-mail não foi alterado',
    },
    mutationFn: ({ userId, email }: UpdateStaffEmailVariables) =>
      StaffService.updateStaffEmail(unitId as string, userId, email),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.team.all(unitId ?? ''),
      })
    },
  })
}
