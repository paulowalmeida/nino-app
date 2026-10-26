import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { StaffService } from '@shared/services/staff/staff.service'

type UpdateStaffProfileVariables = {
  userId: string
  name: string
  email: string
}

export const useUpdateStaffProfile = (unitId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, name, email }: UpdateStaffProfileVariables) =>
      StaffService.updateStaffProfile(unitId as string, userId, {
        name,
        email,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.team.all(unitId ?? ''),
      }),
  })
}
