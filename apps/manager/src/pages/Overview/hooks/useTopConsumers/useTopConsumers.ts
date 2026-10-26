import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { ConsumerService } from '@shared/services/consumer/consumer.service'
import type { TopConsumer } from '@shared/types/consumer/top-consumer'
import type { TopConsumerMetric } from '@shared/types/consumer/top-consumer-metric'

/** Ranking, não fila de trabalho: sem polling, como o relatório de vendas. */
export const useTopConsumers = (
  unitId: string | null,
  metric: TopConsumerMetric,
  limit: number
) => {
  const query = useQuery<TopConsumer[]>({
    queryKey: queryKeys.consumers.top(unitId ?? '', metric),
    queryFn: () =>
      ConsumerService.getTopConsumers(unitId as string, metric, limit),
    enabled: !!unitId,
  })

  return { ...query, topConsumers: query.data ?? [] }
}
