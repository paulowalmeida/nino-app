import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { StaffService } from '@shared/services/staff/staff.service'
import type { TenantRole } from '@shared/types/auth/tenant-role'

type UpdateStaffRoleVariables = {
  userId: string
  role: TenantRole
}

export const useUpdateStaffRole = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Cargo alterado',
      errorTitle: 'O cargo não foi alterado',
    },
    mutationFn: ({ userId, role }: UpdateStaffRoleVariables) =>
      StaffService.updateStaffRole(tenantId as string, userId, role),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.team.all(tenantId ?? ''),
      })
    },
  })
}
