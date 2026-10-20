import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { StaffService } from '@shared/services/staff/staff.service'

type SetStaffActivityVariables = {
  userId: string
  isActive: boolean
}

export const useSetStaffActivity = (unitId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, isActive }: SetStaffActivityVariables) =>
      StaffService.setStaffActivity(unitId as string, userId, isActive),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.team.all(unitId ?? ''),
      }),
  })
}
