import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { ReportRangeParams, SalesReport } from '@custom_types/order'
import { OrderService } from '@services/order.service'

/**
 * Relatório é leitura de análise, não a fila de trabalho: sem polling. A
 * chave carrega o período, então trocar de intervalo troca de cache.
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
