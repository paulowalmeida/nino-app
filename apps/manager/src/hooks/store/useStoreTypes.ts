import { useQuery } from '@tanstack/react-query'

import type { StoreTypeOption } from '@custom_types/store'
import { listStoreTypes } from '@services/store/store.service'

/** Immutable catalog for the length of a session — no refetch on focus. */
export const useStoreTypes = () =>
  useQuery<StoreTypeOption[]>({
    queryKey: ['store-types'],
    queryFn: listStoreTypes,
    staleTime: Infinity,
  })
