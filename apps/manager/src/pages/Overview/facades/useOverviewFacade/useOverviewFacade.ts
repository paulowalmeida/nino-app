import { usePause } from '@pages/Overview/hooks/usePause/usePause'
import { usePauseActions } from '@pages/Overview/hooks/usePauseActions/usePauseActions'
import { useStoreOpen } from '@pages/Overview/hooks/useStoreOpen/useStoreOpen'
import { useTopConsumers } from '@pages/Overview/hooks/useTopConsumers/useTopConsumers'
import { useOrders } from '@shared/hooks/order/useOrders/useOrders'
import { useQueueSummary } from '@shared/hooks/order/useQueueSummary/useQueueSummary'
import { useSalesReport } from '@shared/hooks/order/useSalesReport/useSalesReport'
import { useSalesSeries } from '@shared/hooks/order/useSalesSeries/useSalesSeries'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import { useSessionStore } from '@shared/states/session/session.state'

const TOP_CONSUMERS_LIMIT = 5

export const useOverviewFacade = () => {
  const user = useSessionStore(({ user: currentUser }) => currentUser)
  const unit = useCurrentUnit()
  const unitId = unit?.unitId ?? null
  const timezone = user?.timezone ?? null

  return {
    firstName: user?.name.split(' ')[0] ?? '',
    timezone,
    unit,
    unitId,
    storeOpen: useStoreOpen(unitId, timezone),
    pause: usePause(unitId),
    pauseActions: usePauseActions(unitId),
    orders: useOrders(unitId),
    queueSummary: useQueueSummary(unitId),
    salesSeries: useSalesSeries(unitId, { period: 'week' }),
    salesReport: useSalesReport(unitId, { period: 'week' }),
    topConsumersSpent: useTopConsumers(unitId, 'spent', TOP_CONSUMERS_LIMIT),
    topConsumersOrders: useTopConsumers(unitId, 'orders', TOP_CONSUMERS_LIMIT),
  }
}
