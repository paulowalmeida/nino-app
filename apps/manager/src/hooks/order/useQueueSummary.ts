import { useQuery } from '@tanstack/react-query'

import type { OrderQueueSummary } from '@custom_types/order'
import { getQueueSummary } from '@services/order/order.service'

/**
 * Every 30s: the panel is a workstation, not a report. Kept well under the
 * API's 10 req/min throttle so the board never starves the rest of the app.
 */
export const useQueueSummary = (tenantId: string | null) =>
  useQuery<OrderQueueSummary>({
    queryKey: ['order-queue-summary', tenantId],
    queryFn: () => getQueueSummary(tenantId as string),
    enabled: !!tenantId,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  })
