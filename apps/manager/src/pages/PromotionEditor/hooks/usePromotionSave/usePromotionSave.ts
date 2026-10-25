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
    mutationFn: async (values: PromotionFormValues) => {
      const saved =
        mode === 'edit' && promotionId
          ? await PromotionService.update(
              unitId as string,
              promotionId,
              toPromotionInput(values)
            )
          : await PromotionService.create(
              unitId as string,
              toPromotionInput(values)
            )
      if (values.imageFile) {
        return PromotionService.uploadImage(
          unitId as string,
          saved.id,
          values.imageFile
        )
      }
      if (values.removeImage && saved.imageUrl) {
        return PromotionService.removeImage(unitId as string, saved.id)
      }
      return saved
    },
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
