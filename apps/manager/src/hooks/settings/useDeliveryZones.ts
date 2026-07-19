import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { DeliveryZone } from '@custom_types/settings'
import {
  createDeliveryZone,
  listDeliveryZones,
  removeDeliveryZone,
  updateDeliveryZone,
} from '@services/tenant/settings.service'

const zonesKey = (tenantId: string) => [
  ...queryKeys.tenant.all(tenantId),
  'delivery-zones',
]

export const useDeliveryZones = (tenantId: string | null) => {
  const query = useQuery({
    queryKey: zonesKey(tenantId ?? ''),
    queryFn: () => listDeliveryZones(tenantId as string),
    enabled: !!tenantId,
  })

  const zones: DeliveryZone[] = query.data?.data ?? []

  return { ...query, zones }
}

export const useZoneMutations = (tenantId: string | null) => {
  const queryClient = useQueryClient()

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: zonesKey(tenantId ?? '') })
  }

  const add = useMutation({
    mutationFn: (data: { name: string; fee: number }) =>
      createDeliveryZone(tenantId as string, data),
    onSuccess: invalidate,
  })

  const toggle = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateDeliveryZone(tenantId as string, id, { isActive }),
    onSuccess: invalidate,
  })

  const drop = useMutation({
    mutationFn: (id: string) => removeDeliveryZone(tenantId as string, id),
    onSuccess: invalidate,
  })

  return { add, toggle, drop }
}
