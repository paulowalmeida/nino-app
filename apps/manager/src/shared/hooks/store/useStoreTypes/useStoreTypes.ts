import { useQuery } from '@tanstack/react-query'

import { TenantService } from '@shared/services/tenant/tenant.service'
import type { StoreTypeOption } from '@shared/types/store/store-type-option'

/** Immutable catalog for the length of a session — no refetch on focus. */
export const useStoreTypes = () =>
  useQuery<StoreTypeOption[]>({
    queryKey: ['store-types'],
    queryFn: TenantService.listStoreTypes,
    staleTime: Infinity,
  })
