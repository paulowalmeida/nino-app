import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { OrderService } from '@shared/services/order/order.service'
import type { ReportRangeParams } from '@shared/types/order/report-range-params'
import type { TimingReport } from '@shared/types/order/timing-report'

/**
 * Same regime as the sales report: analytics read, no polling, key tied
 * to the period.
 */
export const useTimingReport = (
  unitId: string | null,
  params: ReportRangeParams
) => {
  const query = useQuery<TimingReport>({
    queryKey: queryKeys.orders.timingReport(unitId ?? '', params),
    queryFn: () => OrderService.getTimingReport(unitId as string, params),
    enabled: !!unitId,
  })

  return { ...query, report: query.data }
}
