import { api } from '@shared/services/http/http.service'
import type { ConsumerHistory } from '@shared/types/consumer/consumer-history'
import type {
  ConsumerHistoryPage,
} from '@shared/types/consumer/consumer-history-page'
import type { ConsumerPage } from '@shared/types/consumer/consumer-page'
import type { TopConsumer } from '@shared/types/consumer/top-consumer'
import type {
  TopConsumerMetric,
} from '@shared/types/consumer/top-consumer-metric'

export const CONSUMER_PAGE_SIZE = 30
export const HISTORY_PAGE_SIZE = 15

export const ConsumerService = {
  listConsumers: (
    unitId: string,
    page: number,
    search?: string
  ): Promise<ConsumerPage> =>
    api.getAll<ConsumerPage>(`units/${unitId}/consumers`, {
      target: 'createdAt',
      direction: 'desc',
      size: CONSUMER_PAGE_SIZE,
      page,
      ...(search ? { search } : {}),
    }),

  listConsumerOrders: (
    unitId: string,
    consumerId: string,
    page: number
  ): Promise<ConsumerHistoryPage> =>
    api.getAll<ConsumerHistoryPage>(
      `units/${unitId}/consumers/${consumerId}/orders`,
      {
        target: 'createdAt',
        direction: 'desc',
        size: HISTORY_PAGE_SIZE,
        page,
      }
    ),

  getById: (unitId: string, consumerId: string): Promise<ConsumerHistory> =>
    api.get<ConsumerHistory>(`units/${unitId}/consumers/${consumerId}`),

  getTopConsumers: (
    unitId: string,
    metric: TopConsumerMetric,
    limit: number
  ): Promise<TopConsumer[]> =>
    api.getAll<TopConsumer[]>(`units/${unitId}/consumers/top`, {
      metric,
      limit,
    }),
}
