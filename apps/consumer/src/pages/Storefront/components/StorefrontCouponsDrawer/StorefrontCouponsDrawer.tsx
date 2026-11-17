import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'

import { CouponsDrawer } from '@shared/components/CouponsDrawer/CouponsDrawer'

/* WHY: a vitrine só mostra a oferta; quem escolhe o cupom é a revisão do
 * pedido. Tocar num cartão da faixa abre o painel já na página dele; o
 * botão do topo abre na lista. */
export const StorefrontCouponsDrawer = () => {
  const {
    promotionPanelOffers,
    couponBlockerOf,
    deliveryZones,
    focusedPromotionId,
    setFocusedPromotionId,
    isCouponsOpen,
    setCouponsOpen,
  } = useStorefrontFacade()

  const close = () => {
    setFocusedPromotionId(null)
    setCouponsOpen(false)
  }

  return (
    <CouponsDrawer
      open={isCouponsOpen || !!focusedPromotionId}
      onOpenChange={(open) => {
        if (!open) close()
      }}
      coupons={promotionPanelOffers}
      blockerOf={couponBlockerOf}
      zones={deliveryZones}
      initialDetailId={focusedPromotionId}
      action={{
        label: 'Ver cardápio',
        disabledWhenBlocked: false,
        mobileOnly: true,
        note: 'Você escolhe o cupom na revisão do pedido.',
        onSelect: close,
      }}
      emptyAvailable="Nenhuma oferta vale para a sacola ainda."
      emptyUnavailable="Todas as ofertas valem para a sacola."
    />
  )
}
