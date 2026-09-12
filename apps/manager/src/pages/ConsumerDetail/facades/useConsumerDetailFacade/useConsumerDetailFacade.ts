import { useParams } from 'react-router'

import { useConsumerDetail } from '@pages/ConsumerDetail/hooks/useConsumerDetail/useConsumerDetail'
import { useConsumerOrderHistory } from '@pages/ConsumerDetail/hooks/useConsumerOrderHistory/useConsumerOrderHistory'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

export const useConsumerDetailFacade = () => {
  const { consumerId } = useParams()
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const detail = useConsumerDetail(tenantId, consumerId ?? '')
  const history = useConsumerOrderHistory(tenantId, consumerId ?? '')

  return {
    consumer: detail.consumer,
    addressRows: detail.addressRows,
    isPending: detail.isPending,
    orderRows: history.orderRows,
    hasNextPage: history.hasNextPage,
    isFetchingNextPage: history.isFetchingNextPage,
    loadMoreOrders: history.loadMoreOrders,
  }
}
