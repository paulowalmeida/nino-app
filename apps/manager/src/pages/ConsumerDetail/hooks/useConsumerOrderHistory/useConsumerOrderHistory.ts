import { useCallback } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'

import { toConsumerOrderRows } from '@pages/ConsumerDetail/adapters/consumerOrderRows.adapter/consumerOrderRows.adapter'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import {
  ConsumerService,
  HISTORY_PAGE_SIZE,
} from '@shared/services/consumer/consumer.service'
import { nextPageParam } from '@shared/utils/next-page-param/next-page-param'

/* WHY: a ficha abre com a primeira página e só busca a próxima quando quem
 * atende chega ao fim da lista, como o cardápio faz com os itens.
 */
export const useConsumerOrderHistory = (
  unitId: string | null,
  consumerId: string
) => {
  const query = useInfiniteQuery({
    queryKey: [
      ...queryKeys.consumers.detail(unitId ?? '', consumerId),
      'orders',
    ],
    queryFn: ({ pageParam }) =>
      ConsumerService.listConsumerOrders(
        unitId as string,
        consumerId,
        pageParam as number
      ),
    initialPageParam: 1,
    getNextPageParam: ({ pagination }) =>
      nextPageParam(pagination, HISTORY_PAGE_SIZE),
    enabled: !!unitId && !!consumerId,
  })

  const { fetchNextPage } = query
  const loadMoreOrders = useCallback(() => {
    void fetchNextPage()
  }, [fetchNextPage])

  const entries = query.data?.pages.flatMap(({ data }) => data) ?? []

  return {
    orderRows: toConsumerOrderRows(entries),
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    loadMoreOrders,
  }
}
