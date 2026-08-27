import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { OrderService } from '@shared/services/order/order.service'
import type { ReportRangeParams } from '@shared/types/order/report-range-params'
import type { SalesSeries } from '@shared/types/order/sales-series'
import type { SeriesGranularity } from '@shared/types/order/series-granularity'

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
