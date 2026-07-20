import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { SalesReport } from '@custom_types/order'
import { getSalesReport } from '@services/order/order.service'

/**
 * Relatório é leitura de análise, não a fila de trabalho: sem polling. A
 * chave carrega o período, então trocar de intervalo troca de cache.
 */
export const useSalesReport = (
  tenantId: string | null,
  from: string,
  to: string
) => {
  const query = useQuery<SalesReport>({
    queryKey: queryKeys.orders.report(tenantId ?? '', from, to),
    queryFn: () => getSalesReport(tenantId as string, from, to),
    enabled: !!tenantId,
  })

  return { ...query, report: query.data }
}
