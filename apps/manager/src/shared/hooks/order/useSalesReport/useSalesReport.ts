import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { OrderService } from '@shared/services/order/order.service'
import type { ReportRangeParams } from '@shared/types/order/report-range-params'
import type { SalesReport } from '@shared/types/order/sales-report'

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
