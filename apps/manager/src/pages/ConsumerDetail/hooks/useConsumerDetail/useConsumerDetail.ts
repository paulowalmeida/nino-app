import { useQuery } from '@tanstack/react-query'

import { toConsumerAddressRows } from '@pages/ConsumerDetail/adapters/consumerAddressRows.adapter/consumerAddressRows.adapter'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { ConsumerService } from '@shared/services/consumer/consumer.service'

export const useConsumerDetail = (
  unitId: string | null,
  consumerId: string
) => {
  const query = useQuery({
    queryKey: queryKeys.consumers.detail(unitId ?? '', consumerId),
    queryFn: () => ConsumerService.getById(unitId as string, consumerId),
    enabled: !!unitId && !!consumerId,
  })

  return {
    consumer: query.data,
    addressRows: toConsumerAddressRows(query.data?.addresses ?? []),
    isPending: query.isPending,
  }
}
