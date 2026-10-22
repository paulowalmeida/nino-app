import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import { promotionService } from '@shared/services/promotion/promotion.service/promotion.service'

// WHY: o cupom sugerido já veio da vitrine; só o digitado precisa consultar a API.
export const useCheckoutCoupon = (unitId: string | undefined) => {
  const [coupon, setCoupon] = useState<PublicPromotion | undefined>()
  const lookup = useMutation({
    mutationFn: (code: string) =>
      promotionService.findCoupon(unitId as string, code.trim()),
    onSuccess: setCoupon,
  })

  return {
    coupon,
    applyCouponCode: lookup.mutate,
    applyCoupon: setCoupon,
    removeCoupon: () => setCoupon(undefined),
    isApplyingCoupon: lookup.isPending,
    couponError: lookup.isError ? 'Cupom inválido ou indisponível' : undefined,
  }
}
