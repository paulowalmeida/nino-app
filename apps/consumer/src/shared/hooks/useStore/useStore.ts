import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { Store } from '@custom_types/store/store'
import { storeService } from '@shared/services/store/store.service'

export const useStore = (slug: string | undefined) => {
  const query = useQuery<Store>({
    queryKey: queryKeys.store.bySlug(slug ?? ''),
    queryFn: () => storeService.getBySlug(slug as string),
    enabled: !!slug,
    staleTime: 0,
    refetchOnWindowFocus: true,
  })

  return { ...query, store: query.data }
}
