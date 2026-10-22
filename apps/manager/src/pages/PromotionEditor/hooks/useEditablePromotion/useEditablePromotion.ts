import { useParams, useSearchParams } from 'react-router'

import type { PromotionEditorMode } from '@pages/PromotionEditor/types/PromotionEditorMode.type'
import { usePromotions } from '@shared/hooks/promotion/usePromotions/usePromotions'

// WHY: editar só existe antes do primeiro uso e nunca numa campanha encerrada.
export const useEditablePromotion = (unitId: string | null) => {
  const { promotionId } = useParams()
  const [searchParams] = useSearchParams()
  const duplicateId = searchParams.get('duplicar')
  const sourceId = promotionId ?? duplicateId
  const mode: PromotionEditorMode = promotionId
    ? 'edit'
    : duplicateId
      ? 'duplicate'
      : 'create'
  const promotions = usePromotions(sourceId ? unitId : null)
  const promotion = promotions.data?.find(({ id }) => id === sourceId)
  const isPending = !!sourceId && promotions.isPending
  const isLocked =
    mode === 'edit' &&
    !!promotion &&
    (promotion.usageCount > 0 || promotion.state === 'ENDED')

  return {
    mode,
    promotion,
    isPending,
    isUnavailable: !!sourceId && !isPending && (!promotion || isLocked),
  }
}
