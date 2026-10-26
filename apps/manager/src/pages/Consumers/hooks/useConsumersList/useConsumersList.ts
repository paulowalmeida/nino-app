import { useCallback } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'

import { toConsumerRows } from '@pages/Consumers/adapters/consumerRows.adapter/consumerRows.adapter'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import {
  CONSUMER_PAGE_SIZE,
  ConsumerService,
} from '@shared/services/consumer/consumer.service'
import { nextPageParam } from '@shared/utils/next-page-param/next-page-param'

export const useConsumersList = (unitId: string | null, search: string) => {
  const term = search.trim() || undefined

  const query = useInfiniteQuery({
    queryKey: queryKeys.consumers.list(unitId ?? '', term),
    queryFn: ({ pageParam }) =>
      ConsumerService.listConsumers(
        unitId as string,
        pageParam as number,
        term
      ),
    initialPageParam: 1,
    getNextPageParam: ({ pagination }) =>
      nextPageParam(pagination, CONSUMER_PAGE_SIZE),
    enabled: !!unitId,
  })

  const { fetchNextPage } = query
  const loadMoreConsumers = useCallback(() => {
    void fetchNextPage()
  }, [fetchNextPage])

  const consumers = query.data?.pages.flatMap(({ data }) => data) ?? []

  return {
    rows: toConsumerRows(consumers),
    total: query.data?.pages[0]?.pagination.total,
    isPending: query.isPending,
    isError: query.isError,
    hasNextPage: query.hasNextPage,
    loadMoreConsumers,
  }
}
