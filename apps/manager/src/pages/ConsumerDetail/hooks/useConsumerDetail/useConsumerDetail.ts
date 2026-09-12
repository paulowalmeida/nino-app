import { useQuery } from '@tanstack/react-query'

import { toConsumerAddressRows } from '@pages/ConsumerDetail/adapters/consumerAddressRows.adapter/consumerAddressRows.adapter'
import { queryKeys } from '@shared/lib/query-keys'
import { ConsumerService } from '@shared/services/consumer/consumer.service'

export const useConsumerDetail = (
  tenantId: string | null,
  consumerId: string
) => {
  const query = useQuery({
    queryKey: queryKeys.consumers.detail(tenantId ?? '', consumerId),
    queryFn: () => ConsumerService.getById(tenantId as string, consumerId),
    enabled: !!tenantId && !!consumerId,
  })

  return {
    consumer: query.data,
    addressRows: toConsumerAddressRows(query.data?.addresses ?? []),
    isPending: query.isPending,
  }
}
