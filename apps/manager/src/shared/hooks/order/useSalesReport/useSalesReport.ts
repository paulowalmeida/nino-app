import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { OrderService } from '@shared/services/order/order.service'
import type { ReportRangeParams } from '@shared/types/order/report-range-params'
import type { SalesReport } from '@shared/types/order/sales-report'

export const useSalesReport = (
  unitId: string | null,
  params: ReportRangeParams
) => {
  const query = useQuery<SalesReport>({
    queryKey: queryKeys.orders.report(unitId ?? '', params),
    queryFn: () => OrderService.getSalesReport(unitId as string, params),
    enabled: !!unitId,
  })

  return { ...query, report: query.data }
}
