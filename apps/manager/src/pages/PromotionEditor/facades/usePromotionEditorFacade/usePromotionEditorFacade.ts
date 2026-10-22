import { useEditablePromotion } from '@pages/PromotionEditor/hooks/useEditablePromotion/useEditablePromotion'
import { useGiftProductOptions } from '@pages/PromotionEditor/hooks/useGiftProductOptions/useGiftProductOptions'
import { usePromotionSave } from '@pages/PromotionEditor/hooks/usePromotionSave/usePromotionSave'
import { useZoneOptions } from '@pages/PromotionEditor/hooks/useZoneOptions/useZoneOptions'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

export const usePromotionEditorFacade = () => {
  const unitId = useCurrentUnit()?.unitId ?? null
  const editable = useEditablePromotion(unitId)
  const zones = useZoneOptions(unitId)
  const gifts = useGiftProductOptions(unitId)
  const save = usePromotionSave(unitId, editable.mode, editable.promotion?.id)

  return {
    ...save,
    mode: editable.mode,
    promotion: editable.promotion,
    isUnavailable: editable.isUnavailable,
    isPending: editable.isPending || zones.isPending || gifts.isPending,
    zoneOptions: zones.zoneOptions,
    giftProductOptions: gifts.giftProductOptions,
  }
}
