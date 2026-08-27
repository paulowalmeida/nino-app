import { useParams } from 'react-router'

import { useCustomerDetail } from '@pages/CustomerDetail/hooks/useCustomerDetail/useCustomerDetail'
import { useCustomerOrderHistory } from '@pages/CustomerDetail/hooks/useCustomerOrderHistory/useCustomerOrderHistory'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

export const useCustomerDetailFacade = () => {
  const { customerId } = useParams()
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const detail = useCustomerDetail(tenantId, customerId ?? '')
  const history = useCustomerOrderHistory(tenantId, customerId ?? '')

  return {
    customer: detail.customer,
    addressRows: detail.addressRows,
    isPending: detail.isPending,
    orderRows: history.orderRows,
    hasNextPage: history.hasNextPage,
    isFetchingNextPage: history.isFetchingNextPage,
    loadMoreOrders: history.loadMoreOrders,
  }
}
