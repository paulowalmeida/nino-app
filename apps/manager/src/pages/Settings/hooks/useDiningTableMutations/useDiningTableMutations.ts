import { useMutation, useQueryClient } from '@tanstack/react-query'

import { DiningTableService } from '@shared/services/dining-table/dining-table.service/dining-table.service'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import type { Page } from '@shared/types/http/page'
import type { DiningTable } from '@shared/types/settings/dining-table'

export const useDiningTableMutations = (unitId: string | null) => {
  const queryClient = useQueryClient()
  const queryKey = queryKeys.unit.diningTables(unitId ?? '')

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey })
  }

  const add = useMutation({
    meta: {
      success: 'Mesa adicionada',
      errorTitle: 'A mesa não foi adicionada',
    },
    mutationFn: (data: { quantity: number; prefix?: string }) =>
      DiningTableService.createBatch(unitId as string, data),
    onSuccess: invalidate,
  })

  const toggle = useMutation({
    meta: { errorTitle: 'A mesa não foi atualizada' },
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      DiningTableService.update(unitId as string, id, { isActive }),
    onSuccess: (updated) => {
      queryClient.setQueryData<Page<DiningTable>>(queryKey, (current) =>
        current
          ? {
              ...current,
              data: current.data.map((table) =>
                table.id === updated.id ? updated : table
              ),
            }
          : current
      )
    },
  })

  const drop = useMutation({
    meta: {
      success: 'Mesa removida',
      errorTitle: 'A mesa não foi removida',
    },
    mutationFn: (id: string) => DiningTableService.remove(unitId as string, id),
    onSuccess: invalidate,
  })

  return { add, toggle, drop }
}
