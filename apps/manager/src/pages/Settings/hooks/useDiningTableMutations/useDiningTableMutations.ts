import { useMutation, useQueryClient } from '@tanstack/react-query'

import { DiningTableService } from '@pages/Settings/services/dining-table/dining-table.service'
import { queryKeys } from '@shared/lib/query-keys'

export const useDiningTableMutations = (tenantId: string | null) => {
  const queryClient = useQueryClient()
  const queryKey = queryKeys.tenant.diningTables(tenantId ?? '')

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey })
  }

  const add = useMutation({
    meta: {
      success: 'Mesa adicionada',
      errorTitle: 'A mesa não foi adicionada',
    },
    mutationFn: (data: { quantity: number; prefix?: string }) =>
      DiningTableService.createBatch(tenantId as string, data),
    onSuccess: invalidate,
  })

  const toggle = useMutation({
    meta: { errorTitle: 'A mesa não foi atualizada' },
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      DiningTableService.update(tenantId as string, id, { isActive }),
    onSuccess: invalidate,
  })

  const drop = useMutation({
    meta: {
      success: 'Mesa removida',
      errorTitle: 'A mesa não foi removida',
    },
    mutationFn: (id: string) =>
      DiningTableService.remove(tenantId as string, id),
    onSuccess: invalidate,
  })

  return { add, toggle, drop }
}
