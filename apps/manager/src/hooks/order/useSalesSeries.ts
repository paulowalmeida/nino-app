import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type {
  ReportRangeParams,
  SalesSeries,
  SeriesGranularity,
} from '@custom_types/order'
import { OrderService } from '@services/order.service'

/**
 * Sales series for the period. No polling, same as the report: it is an
 * analytics read, not the work queue. Granularity is part of the key
 * because it changes the response shape, not just the content.
 */
export const useSalesSeries = (
  tenantId: string | null,
  params: ReportRangeParams,
  granularity?: SeriesGranularity
) => {
  const query = useQuery<SalesSeries>({
    queryKey: queryKeys.orders.series(tenantId ?? '', params, granularity),
    queryFn: () =>
      OrderService.getSalesSeries(tenantId as string, params, granularity),
    enabled: !!tenantId,
  })

  return { ...query, series: query.data }
}
