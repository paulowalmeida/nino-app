import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from '@nino/ds/components/Toast'
import { zonesKey } from '@shared/hooks/delivery-zone/useDeliveryZones/useDeliveryZones'
import { DeliveryZoneService } from '@shared/services/delivery-zone/delivery-zone.service/delivery-zone.service'
import type { ZoneDraft } from '@pages/Settings/types/ZoneDraft.type'

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
    mutationFn: (data: ZoneDraft) =>
      DeliveryZoneService.createDeliveryZone(unitId as string, data),
    onSuccess: invalidate,
  })

  const edit = useMutation({
    meta: { success: 'Faixa salva', errorTitle: 'A faixa não foi salva' },
    mutationFn: ({
      id,
      ...data
    }: Partial<ZoneDraft> & { id: string }) =>
      DeliveryZoneService.updateDeliveryZone(unitId as string, id, data),
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

  const setFreeDelivery = useMutation({
    meta: { errorTitle: 'O frete grátis da faixa não mudou' },
    mutationFn: ({
      id,
      ...data
    }: {
      id: string
      freeDeliveryEnabled?: boolean
      freeDeliveryMinOrder?: number | null
    }) => DeliveryZoneService.updateDeliveryZone(unitId as string, id, data),
    onSuccess: (_zone, { freeDeliveryEnabled }) => {
      invalidate()
      toast.success(
        freeDeliveryEnabled === undefined
          ? 'Mínimo do frete grátis salvo'
          : freeDeliveryEnabled
            ? 'Frete grátis ligado na faixa'
            : 'Frete grátis desligado na faixa'
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

  return { add, edit, toggle, setFreeDelivery, drop }
}
