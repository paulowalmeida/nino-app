import type { useQueryClient } from '@tanstack/react-query'

import { menuQueryKey } from '@shared/hooks/product/useMenu/useMenu'
import { queryKeys } from '@shared/lib/query-keys/query-keys'

export const invalidateCategoryQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  unitId: string | null
) => {
  void queryClient.invalidateQueries({
    queryKey: queryKeys.productCategories.all(unitId ?? ''),
  })
  void queryClient.invalidateQueries({ queryKey: menuQueryKey(unitId) })
}
