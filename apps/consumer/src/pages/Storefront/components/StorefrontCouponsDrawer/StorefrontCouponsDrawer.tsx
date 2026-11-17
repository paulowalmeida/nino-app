import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'

import { CouponsDrawer } from '@shared/components/CouponsDrawer/CouponsDrawer'

/* WHY: a vitrine só mostra a oferta; quem escolhe o cupom é a revisão do
 * pedido. Tocar num cartão da faixa abre o painel já na página dele. */
export const StorefrontCouponsDrawer = () => {
  const {
    promotionPanelOffers,
    couponBlockerOf,
    deliveryZones,
    focusedPromotionId,
    setFocusedPromotionId,
  } = useStorefrontFacade()

  return (
    <CouponsDrawer
      open={!!focusedPromotionId}
      onOpenChange={(open) => {
        if (!open) setFocusedPromotionId(null)
      }}
      coupons={promotionPanelOffers}
      blockerOf={couponBlockerOf}
      zones={deliveryZones}
      initialDetailId={focusedPromotionId}
      action={{
        label: 'Ver cardápio',
        disabledWhenBlocked: false,
        note: 'Você escolhe o cupom na revisão do pedido.',
        onSelect: () => setFocusedPromotionId(null),
      }}
      emptyAvailable="Nenhuma oferta vale para a sacola ainda."
      emptyUnavailable="Todas as ofertas valem para a sacola."
    />
  )
}
