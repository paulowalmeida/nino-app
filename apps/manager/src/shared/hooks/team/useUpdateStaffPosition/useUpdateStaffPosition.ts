import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { StaffService } from '@shared/services/staff/staff.service'

type UpdateStaffPositionVariables = {
  userId: string
  positionId: string
}

export const useUpdateStaffPosition = (unitId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Cargo alterado',
      errorTitle: 'O cargo não foi alterado',
    },
    mutationFn: ({ userId, positionId }: UpdateStaffPositionVariables) =>
      StaffService.updateStaffPosition(unitId as string, userId, positionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.team.all(unitId ?? ''),
      })
    },
  })
}
