import { useCallback } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'

import { toCustomerRows } from '@pages/Customers/adapters/customerRows.adapter/customerRows.adapter'
import { queryKeys } from '@shared/lib/query-keys'
import { CUSTOMER_PAGE_SIZE, CustomerService } from '@shared/services/customer/customer.service'
import { nextPageParam } from '@shared/utils/next-page-param/next-page-param'

export const useCustomersList = (tenantId: string | null, search: string) => {
  const term = search.trim() || undefined

  const query = useInfiniteQuery({
    queryKey: queryKeys.customers.list(tenantId ?? '', term),
    queryFn: ({ pageParam }) =>
      CustomerService.listCustomers(
        tenantId as string,
        pageParam as number,
        term
      ),
    initialPageParam: 1,
    getNextPageParam: ({ pagination }) =>
      nextPageParam(pagination, CUSTOMER_PAGE_SIZE),
    enabled: !!tenantId,
  })

  const { fetchNextPage } = query
  const loadMoreCustomers = useCallback(() => {
    void fetchNextPage()
  }, [fetchNextPage])

  const customers = query.data?.pages.flatMap(({ data }) => data) ?? []

  return {
    rows: toCustomerRows(customers),
    total: query.data?.pages[0]?.pagination.total,
    isPending: query.isPending,
    isError: query.isError,
    hasNextPage: query.hasNextPage,
    loadMoreCustomers,
  }
}
