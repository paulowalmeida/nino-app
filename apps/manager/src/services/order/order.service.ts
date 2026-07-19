import type { OrderQueueSummary } from '@custom_types/order'
import { ApiFactory } from '@services/api/api.service'

const { get } = ApiFactory()

export const getQueueSummary = (
  tenantId: string
): Promise<OrderQueueSummary> =>
  get<OrderQueueSummary>(`tenants/${tenantId}/orders/summary`)
