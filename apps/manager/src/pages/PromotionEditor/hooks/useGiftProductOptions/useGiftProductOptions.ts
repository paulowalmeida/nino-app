import { toGiftProductOptions } from '@pages/PromotionEditor/adapters/giftProductOptions.adapter/giftProductOptions.adapter'
import { useMenu } from '@shared/hooks/product/useMenu/useMenu'

export const useGiftProductOptions = (unitId: string | null) => {
  const { data, isPending } = useMenu(unitId)
  return { giftProductOptions: toGiftProductOptions(data?.data), isPending }
}
