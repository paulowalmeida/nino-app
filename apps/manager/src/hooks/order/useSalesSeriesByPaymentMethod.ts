import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { ReportRangeParams } from '@custom_types/order/report-range-params'
import type {
  SalesSeriesBreakdown,
} from '@custom_types/order/sales-series-breakdown'
import type { SeriesGranularity } from '@custom_types/order/series-granularity'
import { OrderService } from '@services/order.service'

/**
 * Revenue series broken down by payment method, one line per method. Same
 * granularity-in-key reasoning as `useSalesSeries` — it changes the shape.
 */
export const useSalesSeriesByPaymentMethod = (
  tenantId: string | null,
  params: ReportRangeParams,
  granularity?: SeriesGranularity
) => {
  const query = useQuery<SalesSeriesBreakdown>({
    queryKey: queryKeys.orders.seriesByPaymentMethod(
      tenantId ?? '',
      params,
      granularity
    ),
    queryFn: () =>
      OrderService.getSalesSeriesByPaymentMethod(
        tenantId as string,
        params,
        granularity
      ),
    enabled: !!tenantId,
  })

  return { ...query, breakdown: query.data }
}
