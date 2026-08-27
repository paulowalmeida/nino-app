import { usePause } from '@pages/Overview/hooks/usePause/usePause'
import { usePauseActions } from '@pages/Overview/hooks/usePauseActions/usePauseActions'
import { useStoreOpen } from '@pages/Overview/hooks/useStoreOpen/useStoreOpen'
import { useTopCustomers } from '@pages/Overview/hooks/useTopCustomers/useTopCustomers'
import { useOrders } from '@shared/hooks/order/useOrders/useOrders'
import { useQueueSummary } from '@shared/hooks/order/useQueueSummary/useQueueSummary'
import { useSalesReport } from '@shared/hooks/order/useSalesReport/useSalesReport'
import { useSalesSeries } from '@shared/hooks/order/useSalesSeries/useSalesSeries'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'
import { useSessionStore } from '@shared/states/session/session.state'

const TOP_CUSTOMERS_LIMIT = 5

export const useOverviewFacade = () => {
  const user = useSessionStore(({ user: currentUser }) => currentUser)
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null
  const timezone = user?.timezone ?? null

  return {
    firstName: user?.name.split(' ')[0] ?? '',
    timezone,
    tenant,
    tenantId,
    storeOpen: useStoreOpen(tenantId, timezone),
    pause: usePause(tenantId),
    pauseActions: usePauseActions(tenantId),
    orders: useOrders(tenantId),
    queueSummary: useQueueSummary(tenantId),
    salesSeries: useSalesSeries(tenantId, { period: 'week' }),
    salesReport: useSalesReport(tenantId, { period: 'week' }),
    topCustomersSpent: useTopCustomers(tenantId, 'spent', TOP_CUSTOMERS_LIMIT),
    topCustomersOrders: useTopCustomers(
      tenantId,
      'orders',
      TOP_CUSTOMERS_LIMIT
    ),
  }
}
