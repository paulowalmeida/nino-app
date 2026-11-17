import { Box } from '@nino/ds/components/Box'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import {
  promotionBenefit,
  promotionDetail,
} from '@utils/promotion-label/promotion-label'

import styles from './PromotionArt.module.css'

const ICONS = {
  FREE_DELIVERY: 'truck',
  PERCENTAGE_DISCOUNT: 'tag',
  FIXED_DISCOUNT: 'tag',
  GIFT: 'gift',
  PACKAGE: 'tag',
} as const

type PromotionArtProps = {
  promotion: PublicPromotion
  onSelect: (promotion: PublicPromotion) => void
}

/**
 * WHY: a arte nasce dos dados da promoção (tipo, valor, condição) e da cor da
 * loja, então toda loja tem cartaz de oferta na marca sem subir imagem. A
 * imagem enviada, quando existe, substitui esta arte no carrossel.
 */
export const PromotionArt = ({ promotion, onSelect }: PromotionArtProps) => (
  <button
    type="button"
    className={`${styles.art} ${
      promotion.type === 'FREE_DELIVERY' ? styles.freeDelivery : ''
    }`}
    onClick={() => onSelect(promotion)}
  >
    <Box className={styles.badge}>
      <Icon name={ICONS[promotion.type]} />
    </Box>
    <Box className={styles.text}>
      <Text as="span" className={styles.benefit}>
        {promotionBenefit(promotion)}
      </Text>
      <Text as="span" className={styles.detail}>
        {promotionDetail(promotion)}
      </Text>
    </Box>
  </button>
)
