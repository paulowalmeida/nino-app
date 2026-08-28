import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from '@nino/ds/components/Toast'
import { DeliveryZoneService } from '@pages/Settings/services/delivery-zone/delivery-zone.service'

import { zonesKey } from '../useDeliveryZones/useDeliveryZones'

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
    mutationFn: (data: {
      name: string
      minRadiusKm: number
      maxRadiusKm: number
      fee: number
    }) => DeliveryZoneService.createDeliveryZone(tenantId as string, data),
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
      minRadiusKm: number
      maxRadiusKm: number
      fee: number
    }) => DeliveryZoneService.updateDeliveryZone(tenantId as string, id, data),
    onSuccess: invalidate,
  })

  const toggle = useMutation({
    meta: { errorTitle: 'A entrega nessa região não mudou' },
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      DeliveryZoneService.updateDeliveryZone(tenantId as string, id, {
        isActive,
      }),
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
    mutationFn: (id: string) =>
      DeliveryZoneService.removeDeliveryZone(tenantId as string, id),
    onSuccess: invalidate,
  })

  return { add, edit, toggle, drop }
}
