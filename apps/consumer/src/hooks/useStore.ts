import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { Store } from '@custom_types/store/store'
import { getStoreBySlug } from '@services/store/store.service'

export const useStore = (slug: string | undefined) => {
  const query = useQuery<Store>({
    queryKey: queryKeys.store.bySlug(slug ?? ''),
    queryFn: () => getStoreBySlug(slug as string),
    enabled: !!slug,
  })

  return { ...query, store: query.data }
}
