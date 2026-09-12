import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys'
import { ConsumerService } from '@shared/services/consumer/consumer.service'
import type { TopConsumer } from '@shared/types/consumer/top-consumer'
import type {
  TopConsumerMetric,
} from '@shared/types/consumer/top-consumer-metric'

/** Ranking, não fila de trabalho: sem polling, como o relatório de vendas. */
export const useTopConsumers = (
  tenantId: string | null,
  metric: TopConsumerMetric,
  limit: number
) => {
  const query = useQuery<TopConsumer[]>({
    queryKey: queryKeys.consumers.top(tenantId ?? '', metric),
    queryFn: () =>
      ConsumerService.getTopConsumers(tenantId as string, metric, limit),
    enabled: !!tenantId,
  })

  return { ...query, topConsumers: query.data ?? [] }
}
