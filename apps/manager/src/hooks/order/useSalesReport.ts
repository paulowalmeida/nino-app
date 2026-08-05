import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { ReportRangeParams } from '@custom_types/order/report-range-params'
import type { SalesReport } from '@custom_types/order/sales-report'
import { OrderService } from '@services/order.service'

/**
 * A report is an analytics read, not the work queue: no polling. The key
 * carries the period, so switching the range switches the cache.
 */
export const useSalesReport = (
  tenantId: string | null,
  params: ReportRangeParams
) => {
  const query = useQuery<SalesReport>({
    queryKey: queryKeys.orders.report(tenantId ?? '', params),
    queryFn: () => OrderService.getSalesReport(tenantId as string, params),
    enabled: !!tenantId,
  })

  return { ...query, report: query.data }
}
