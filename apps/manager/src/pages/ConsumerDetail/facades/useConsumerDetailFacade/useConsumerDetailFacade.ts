import { useParams } from 'react-router'

import { useConsumerDetail } from '@pages/ConsumerDetail/hooks/useConsumerDetail/useConsumerDetail'
import { useConsumerOrderHistory } from '@pages/ConsumerDetail/hooks/useConsumerOrderHistory/useConsumerOrderHistory'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

export const useConsumerDetailFacade = () => {
  const { consumerId } = useParams()
  const unitId = useCurrentUnit()?.unitId ?? null
  const detail = useConsumerDetail(unitId, consumerId ?? '')
  const history = useConsumerOrderHistory(unitId, consumerId ?? '')

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
