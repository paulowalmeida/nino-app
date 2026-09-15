import { useQuery } from '@tanstack/react-query'

import { OrderService } from '@shared/services/order/order.service'
import type { OrderQueueSummary } from '@shared/types/order/order-queue-summary'

/**
 * Every 30s: the panel is a workstation, not a report. Kept well under the
 * API's 10 req/min throttle so the board never starves the rest of the app.
 */
export const useQueueSummary = (unitId: string | null) =>
  useQuery<OrderQueueSummary>({
    queryKey: ['order-queue-summary', unitId],
    queryFn: () => OrderService.getQueueSummary(unitId as string),
    enabled: !!unitId,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  })
