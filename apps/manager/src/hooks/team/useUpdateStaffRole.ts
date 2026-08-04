import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { TenantRole } from '@custom_types/auth'
import { queryKeys } from '@constants/query-keys'
import { StaffService } from '@services/staff.service'

/**
 * O erro aparece em toast porque a recusa é a informação: "a loja precisa de
 * pelo menos um dono" é o que a pessoa precisa ler para saber o que fazer.
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
