import { useNavigate } from 'react-router'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toPromotionInput } from '@pages/PromotionEditor/adapters/promotionForm.adapter/promotionForm.adapter'
import type { PromotionEditorMode } from '@pages/PromotionEditor/types/PromotionEditorMode.type'
import type { PromotionFormValues } from '@pages/PromotionEditor/types/PromotionFormValues.type'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { PromotionService } from '@shared/services/promotion/promotion.service/promotion.service'

export const usePromotionSave = (
  unitId: string | null,
  mode: PromotionEditorMode,
  promotionId?: string
) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const backToList = () => void navigate('..', { relative: 'path' })

  const save = useMutation({
    meta: {
      success: mode === 'edit' ? 'Campanha salva' : 'Campanha criada',
      errorTitle: 'A campanha não foi salva',
    },
    mutationFn: (values: PromotionFormValues) =>
      mode === 'edit' && promotionId
        ? PromotionService.update(
            unitId as string,
            promotionId,
            toPromotionInput(values)
          )
        : PromotionService.create(unitId as string, toPromotionInput(values)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.promotions.list(unitId ?? ''),
      })
      backToList()
    },
  })

  return {
    savePromotion: save.mutate,
    isSaving: save.isPending,
    cancel: backToList,
  }
}
