import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { StaffService } from '@shared/services/staff/staff.service'
import type { UnitRole } from '@shared/types/auth/unit-role'

type UpdateStaffRoleVariables = {
  userId: string
  role: UnitRole
}

export const useUpdateStaffRole = (unitId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Cargo alterado',
      errorTitle: 'O cargo não foi alterado',
    },
    mutationFn: ({ userId, role }: UpdateStaffRoleVariables) =>
      StaffService.updateStaffRole(unitId as string, userId, role),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.team.all(unitId ?? ''),
      })
    },
  })
}
