import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { ReportRangeParams, TimingReport } from '@custom_types/order'
import { getTimingReport } from '@services/order/order.service'

/**
 * Mesmo regime do sales report: leitura de análise, sem polling, chave presa
 * ao período.
 */
export const useTimingReport = (
  tenantId: string | null,
  params: ReportRangeParams
) => {
  const query = useQuery<TimingReport>({
    queryKey: queryKeys.orders.timingReport(tenantId ?? '', params),
    queryFn: () => getTimingReport(tenantId as string, params),
    enabled: !!tenantId,
  })

  return { ...query, report: query.data }
}
