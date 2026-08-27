import type { useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'

import { menuQueryKey } from '../useMenu/useMenu'

export const invalidateCategoryQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  tenantId: string | null
) => {
  void queryClient.invalidateQueries({
    queryKey: queryKeys.productCategories.all(tenantId ?? ''),
  })
  void queryClient.invalidateQueries({ queryKey: menuQueryKey(tenantId) })
}
