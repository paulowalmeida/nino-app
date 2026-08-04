import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { TenantRole } from '@custom_types/auth'
import { queryKeys } from '@constants/query-keys'
import { StaffService } from '@services/staff.service'

/**
 * The error surfaces as a toast because the rejection itself is the
 * information: "the store needs at least one owner" is what the person
 * needs to read to know what to do.
 */
export const useUpdateStaffRole = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { success: 'Cargo atualizado' },
    mutationFn: ({ userId, role }: { userId: string; role: TenantRole }) =>
      StaffService.updateStaffRole(tenantId as string, userId, role),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.team.all(tenantId ?? ''),
      })
    },
  })
}
