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
    tenantId: string,
    page: number,
    search?: string
  ): Promise<ConsumerPage> =>
    api.getAll<ConsumerPage>(`tenants/${tenantId}/consumers`, {
      target: 'createdAt',
      direction: 'desc',
      size: CONSUMER_PAGE_SIZE,
      page,
      ...(search ? { search } : {}),
    }),

  listConsumerOrders: (
    tenantId: string,
    consumerId: string,
    page: number
  ): Promise<ConsumerHistoryPage> =>
    api.getAll<ConsumerHistoryPage>(
      `tenants/${tenantId}/consumers/${consumerId}/orders`,
      {
        target: 'createdAt',
        direction: 'desc',
        size: HISTORY_PAGE_SIZE,
        page,
      }
    ),

  getById: (tenantId: string, consumerId: string): Promise<ConsumerHistory> =>
    api.get<ConsumerHistory>(`tenants/${tenantId}/consumers/${consumerId}`),

  getTopConsumers: (
    tenantId: string,
    metric: TopConsumerMetric,
    limit: number
  ): Promise<TopConsumer[]> =>
    api.getAll<TopConsumer[]>(`tenants/${tenantId}/consumers/top`, {
      metric,
      limit,
    }),
}
