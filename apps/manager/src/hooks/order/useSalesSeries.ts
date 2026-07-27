import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { SalesSeries, SeriesGranularity } from '@custom_types/order'
import { getSalesSeries } from '@services/order/order.service'

/**
 * Série de venda do período. Sem polling, como o relatório: é leitura de
 * análise, não a fila de trabalho. A granularidade entra na chave porque
 * muda o formato da resposta, não só o conteúdo.
 */
export const useSalesSeries = (
  tenantId: string | null,
  from: string,
  to: string,
  granularity?: SeriesGranularity
) => {
  const query = useQuery<SalesSeries>({
    queryKey: queryKeys.orders.series(tenantId ?? '', from, to, granularity),
    queryFn: () => getSalesSeries(tenantId as string, from, to, granularity),
    enabled: !!tenantId,
  })

  return { ...query, series: query.data }
}
