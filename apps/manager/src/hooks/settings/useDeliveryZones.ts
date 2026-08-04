import { toast } from '@nino/ds/components/Toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@constants/query-keys'
import type { DeliveryZone } from '@custom_types/settings'
import { DeliveryZoneService } from '@services/delivery-zone.service'

const zonesKey = (tenantId: string) => [
  ...queryKeys.tenant.all(tenantId),
  'delivery-zones',
]

export const useDeliveryZones = (tenantId: string | null) => {
  const query = useQuery({
    queryKey: zonesKey(tenantId ?? ''),
    queryFn: () => DeliveryZoneService.listDeliveryZones(tenantId as string),
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
    meta: {
      success: 'Região adicionada',
      errorTitle: 'A região não foi adicionada',
    },
    mutationFn: (data: { name: string; fee: number }) =>
      DeliveryZoneService.createDeliveryZone(tenantId as string, data),
    onSuccess: invalidate,
  })

  const edit = useMutation({
    meta: { success: 'Região salva', errorTitle: 'A região não foi salva' },
    mutationFn: ({
      id,
      ...data
    }: {
      id: string
      name: string
      fee: number
    }) => DeliveryZoneService.updateDeliveryZone(tenantId as string, id, data),
    onSuccess: invalidate,
  })

  const toggle = useMutation({
    meta: { errorTitle: 'A entrega nessa região não mudou' },
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      DeliveryZoneService.updateDeliveryZone(tenantId as string, id, { isActive }),
    onSuccess: (_zone, { isActive }) => {
      invalidate()
      toast.success(
        isActive ? 'Entrega ligada na região' : 'Entrega desligada na região'
      )
    },
  })

  const drop = useMutation({
    meta: {
      success: 'Região removida',
      errorTitle: 'A região não foi removida',
    },
    mutationFn: (id: string) => DeliveryZoneService.removeDeliveryZone(tenantId as string, id),
    onSuccess: invalidate,
  })

  return { add, edit, toggle, drop }
}
