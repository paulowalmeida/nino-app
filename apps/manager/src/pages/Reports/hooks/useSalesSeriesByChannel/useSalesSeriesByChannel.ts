import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { OrderService } from '@shared/services/order/order.service'
import type { ReportRangeParams } from '@shared/types/order/report-range-params'
import type {
  SalesSeriesBreakdown,
} from '@shared/types/order/sales-series-breakdown'
import type { SeriesGranularity } from '@shared/types/order/series-granularity'

/**
 * Revenue series broken down by channel, one line per channel. Same
 * granularity-in-key reasoning as `useSalesSeries` — it changes the shape.
 */
export const useSalesSeriesByChannel = (
  tenantId: string | null,
  params: ReportRangeParams,
  granularity?: SeriesGranularity
) => {
  const query = useQuery<SalesSeriesBreakdown>({
    queryKey: queryKeys.orders.seriesByChannel(
      tenantId ?? '',
      params,
      granularity
    ),
    queryFn: () =>
      OrderService.getSalesSeriesByChannel(
        tenantId as string,
        params,
        granularity
      ),
    enabled: !!tenantId,
  })

  return { ...query, breakdown: query.data }
}
