import type { useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'

import { menuQueryKey } from './useMenu'

export const invalidateCategoryQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  tenantId: string | null
) => {
  void queryClient.invalidateQueries({
    queryKey: queryKeys.productCategories.all(tenantId ?? ''),
  })
  void queryClient.invalidateQueries({ queryKey: menuQueryKey(tenantId) })
}
