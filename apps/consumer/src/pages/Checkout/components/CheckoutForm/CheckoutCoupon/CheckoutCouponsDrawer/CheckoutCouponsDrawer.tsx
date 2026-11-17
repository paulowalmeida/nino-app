import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import type { CheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'

import { CouponsDrawer } from '@shared/components/CouponsDrawer/CouponsDrawer'

type CheckoutCouponsDrawerProps = {
  checkout?: CheckoutFacade
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const CheckoutCouponsDrawer = ({
  checkout,
  open,
  onOpenChange,
}: CheckoutCouponsDrawerProps) => {
  const {
    coupon,
    couponBlockerOf,
    couponSuggestions,
    zones,
    applyCouponCode,
    applyCoupon,
    isApplyingCoupon,
    couponError,
  } = useCheckoutFacade(checkout)

  return (
    <CouponsDrawer
      open={open}
      onOpenChange={onOpenChange}
      coupons={couponSuggestions}
      blockerOf={couponBlockerOf}
      zones={zones}
      appliedId={coupon?.id}
      codeForm={{
        onSubmit: applyCouponCode,
        isLoading: isApplyingCoupon,
        error: couponError,
      }}
      action={{
        label: 'Aplicar cupom',
        disabledWhenBlocked: true,
        onSelect: (promotion) => {
          applyCoupon(promotion)
          onOpenChange(false)
        },
      }}
      emptyAvailable="Nenhum cupom vale para este pedido ainda."
      emptyUnavailable="Todos os cupons da loja valem para este pedido."
    />
  )
}
