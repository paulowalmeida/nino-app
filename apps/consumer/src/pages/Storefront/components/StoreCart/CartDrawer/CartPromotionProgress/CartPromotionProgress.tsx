import { Box } from '@nino/ds/components/Box'
import { ProgressLine } from '@nino/ds/components/ProgressLine'
import { Text } from '@nino/ds/components/Text'
import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { freeDeliveryGap } from '@utils/free-delivery/free-delivery'
import { brl } from '@utils/money/money'

import styles from './CartPromotionProgress.module.css'

const goalOf = (offer: PublicPromotion): string =>
  offer.type === 'GIFT'
    ? `ganhar ${offer.giftProduct?.name ?? 'o brinde'}`
    : 'frete grátis'

const reachedOf = (offer: PublicPromotion): string =>
  offer.type === 'GIFT'
    ? `${offer.giftProduct?.name ?? 'Brinde'} de brinde no pedido`
    : 'Frete grátis liberado na entrega'

export const CartPromotionProgress = () => {
  const { freeDelivery, giftOffer, cartTotal } = useStorefrontFacade()
  const offers = [freeDelivery, giftOffer].filter((offer) => !!offer)

  if (!offers.length) return null

  return (
    <Box className={styles.cartPromotionProgress}>
      {offers.map((offer) => {
        const gap = freeDeliveryGap(offer, cartTotal)
        return gap === 0 ? (
          <Text key={offer.id} role="status" className={styles.promotionReached}>
            {reachedOf(offer)}
          </Text>
        ) : (
          <Box key={offer.id} className={styles.promotionProgress} role="status">
            <Text className={styles.promotionGap}>
              Faltam <strong>{brl(gap)}</strong> para {goalOf(offer)}
            </Text>
            <ProgressLine
              size="sm"
              value={cartTotal}
              max={offer.minOrderValue}
              label={`Faltam ${brl(gap)} para ${goalOf(offer)}`}
            />
          </Box>
        )
      })}
    </Box>
  )
}
