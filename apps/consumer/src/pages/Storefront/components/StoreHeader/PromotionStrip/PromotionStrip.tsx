import { Box } from '@nino/ds/components/Box'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { promotionLabel } from '@utils/promotion-label/promotion-label'

import styles from './PromotionStrip.module.css'

export const PromotionStrip = () => {
  const { freeDelivery, discountOffer } = useStorefrontFacade()
  const offers = [freeDelivery, discountOffer].filter((offer) => !!offer)

  if (!offers.length) return null

  return (
    <Box className={styles.promotionStrip}>
      {offers.map((offer) => (
        <Box key={offer.id} direction="row" className={styles.promotionOffer}>
          <Icon
            name={offer.type === 'FREE_DELIVERY' ? 'truck' : 'tag'}
            size="sm"
            className={styles.promotionIcon}
          />
          <Text as="p" className={styles.promotionText}>
            {promotionLabel(offer)}
          </Text>
        </Box>
      ))}
    </Box>
  )
}
