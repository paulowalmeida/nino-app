import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { ReportRangeParams } from '@custom_types/order/report-range-params'
import type { TimingReport } from '@custom_types/order/timing-report'
import { OrderService } from '@services/order.service'

/**
 * Same regime as the sales report: analytics read, no polling, key tied
 * to the period.
 */
export const useTimingReport = (
  tenantId: string | null,
  params: ReportRangeParams
) => {
  const query = useQuery<TimingReport>({
    queryKey: queryKeys.orders.timingReport(tenantId ?? '', params),
    queryFn: () => OrderService.getTimingReport(tenantId as string, params),
    enabled: !!tenantId,
  })

  return { ...query, report: query.data }
}
