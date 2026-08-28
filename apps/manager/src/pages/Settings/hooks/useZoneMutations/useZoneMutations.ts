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
      errorTitle: 'A faixa não foi adicionada',
    },
    mutationFn: (data: { maxRadiusKm: number; fee: number }) =>
      DeliveryZoneService.createDeliveryZone(tenantId as string, data),
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
    }) => DeliveryZoneService.updateDeliveryZone(tenantId as string, id, data),
    onSuccess: invalidate,
  })

  const toggle = useMutation({
    meta: { errorTitle: 'A entrega nessa faixa não mudou' },
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      DeliveryZoneService.updateDeliveryZone(tenantId as string, id, {
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
      DeliveryZoneService.removeDeliveryZone(tenantId as string, id),
    onSuccess: invalidate,
  })

  return { add, edit, toggle, drop }
}
