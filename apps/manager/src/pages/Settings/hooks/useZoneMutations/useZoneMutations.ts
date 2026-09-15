import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from '@nino/ds/components/Toast'
import { DeliveryZoneService } from '@pages/Settings/services/delivery-zone/delivery-zone.service'

import { zonesKey } from '../useDeliveryZones/useDeliveryZones'

export const useZoneMutations = (unitId: string | null) => {
  const queryClient = useQueryClient()

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: zonesKey(unitId ?? '') })
  }

  const add = useMutation({
    meta: {
      success: 'Região adicionada',
      errorTitle: 'A faixa não foi adicionada',
    },
    mutationFn: (data: { maxRadiusKm: number; fee: number }) =>
      DeliveryZoneService.createDeliveryZone(unitId as string, data),
    onSuccess: invalidate,
  })

  const edit = useMutation({
    meta: { success: 'Faixa salva', errorTitle: 'A faixa não foi salva' },
    mutationFn: ({
      id,
      ...data
    }: {
      id: string
      maxRadiusKm: number
      fee: number
    }) => DeliveryZoneService.updateDeliveryZone(unitId as string, id, data),
    onSuccess: invalidate,
  })

  const toggle = useMutation({
    meta: { errorTitle: 'A entrega nessa faixa não mudou' },
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      DeliveryZoneService.updateDeliveryZone(unitId as string, id, {
        isActive,
      }),
    onSuccess: (_zone, { isActive }) => {
      invalidate()
      toast.success(
        isActive ? 'Entrega ligada na faixa' : 'Entrega desligada na faixa'
      )
    },
  })

  const drop = useMutation({
    meta: {
      success: 'Região removida',
      errorTitle: 'A faixa não foi removida',
    },
    mutationFn: (id: string) =>
      DeliveryZoneService.removeDeliveryZone(unitId as string, id),
    onSuccess: invalidate,
  })

  return { add, edit, toggle, drop }
}
