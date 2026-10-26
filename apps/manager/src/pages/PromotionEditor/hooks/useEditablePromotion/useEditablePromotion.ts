import { useParams, useSearchParams } from 'react-router'

import type { PromotionEditorMode } from '@pages/PromotionEditor/types/PromotionEditorMode.type'
import { usePromotion } from '@shared/hooks/promotion/usePromotion/usePromotion'

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
  const source = usePromotion(unitId, sourceId)
  const promotion = source.data
  const isPending = !!sourceId && source.isPending
  const isRetiredType = promotion?.type === 'FREE_DELIVERY'
  const isLocked =
    isRetiredType ||
    (mode === 'edit' &&
      !!promotion &&
      (promotion.usageCount > 0 || promotion.state === 'ENDED'))

  return {
    mode,
    promotion,
    isPending,
    isUnavailable: !!sourceId && !isPending && (!promotion || isLocked),
  }
}
