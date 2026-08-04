import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import { CourierService } from '@services/courier.service'
import { StaffService } from '@services/staff.service'

type Removal = {
  id: string
  kind: 'STAFF' | 'COURIER'
}

/** Removes the person from this store — their account still exists. */
export const useRemoveMember = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    meta: {
      success: 'Pessoa removida da loja',
      errorTitle: 'A pessoa continua na loja',
    },
    mutationFn: ({ id, kind }: Removal) =>
      kind === 'STAFF'
        ? StaffService.removeStaff(tenantId as string, id)
        : CourierService.removeCourier(tenantId as string, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.team.all(tenantId ?? ''),
      })
    },
  })
}
