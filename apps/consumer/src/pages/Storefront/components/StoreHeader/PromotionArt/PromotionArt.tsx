import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import { brl } from '@utils/money/money'
import {
  promotionBenefit,
  promotionDetail,
} from '@utils/promotion-label/promotion-label'

import { DiscountTagArt } from '@pages/Storefront/components/StoreHeader/DiscountTagArt/DiscountTagArt'

import styles from './PromotionArt.module.css'

const TAG_GLYPHS = {
  FREE_DELIVERY: 'R$',
  PERCENTAGE_DISCOUNT: '%',
  FIXED_DISCOUNT: 'R$',
  GIFT: '+1',
  PACKAGE: 'R$',
} as const

type Amount = {
  currency?: string
  whole: string
  fraction?: string
  suffix?: string
}

type Headline = {
  lead?: string
  text?: string
  amount?: Amount
  tail?: string
}

const moneyAmount = (value: number): Amount => {
  const cents = Math.round((value % 1) * 100)
  return {
    currency: 'R$',
    whole: Math.trunc(value).toLocaleString('pt-BR'),
    fraction: cents ? `,${String(cents).padStart(2, '0')}` : undefined,
  }
}

const headlineOf = (promotion: PublicPromotion): Headline => {
  const { type, value, maxDiscount, giftProduct } = promotion
  if (type === 'FREE_DELIVERY') return { text: 'Frete grátis' }
  if (type === 'GIFT')
    return { lead: 'Ganhe', text: giftProduct?.name ?? 'um brinde' }
  if (type === 'PACKAGE')
    return { lead: 'Promoção por', amount: moneyAmount(value) }
  if (type === 'FIXED_DISCOUNT')
    return { amount: moneyAmount(value), tail: 'de desconto' }
  return {
    amount: { whole: String(value), suffix: '%' },
    tail: maxDiscount ? `de desconto, até ${brl(maxDiscount)}` : 'de desconto',
  }
}

type PromotionArtProps = {
  promotion: PublicPromotion
  /** Fotos do cardápio que dão cara de comida ao cartaz (até duas). */
  photos?: string[]
  onSelect: (promotion: PublicPromotion) => void
}

/**
 * WHY: a arte nasce dos dados da promoção (tipo, valor, condição), da cor da
 * loja e das fotos do próprio cardápio, então toda loja tem cartaz de oferta
 * com comida sem subir imagem. A imagem enviada, quando existe, substitui
 * esta arte no carrossel.
 */
export const PromotionArt = ({
  promotion,
  photos = [],
  onSelect,
}: PromotionArtProps) => {
  const { lead, text, amount, tail } = headlineOf(promotion)
  const detail = promotionDetail(promotion)
  const [mainPhoto, sidePhoto] = photos
  const isFreeDelivery = promotion.type === 'FREE_DELIVERY'
  /* WHY: desconto em qualquer pedido não tem prato próprio; uma foto aleatória
     do cardápio sugeriria que só aquele item tem desconto */
  const isStoreWideDiscount =
    (promotion.type === 'FIXED_DISCOUNT' ||
      promotion.type === 'PERCENTAGE_DISCOUNT') &&
    !promotion.eligibleProductIds?.length
  const showsPhotos = !isFreeDelivery && !isStoreWideDiscount && !!mainPhoto

  return (
    <button
      type="button"
      className={`${styles.art} ${
        isFreeDelivery ? styles.freeDelivery : ''
      }`}
      aria-label={`${promotionBenefit(promotion)}. ${detail}`}
      onClick={() => onSelect(promotion)}
    >
      <Box className={styles.poster} aria-hidden="true">
        <Box className={styles.copy}>
          {lead && (
            <Text as="span" className={styles.lead}>
              {lead}
            </Text>
          )}
          {text && (
            <Text
              as="span"
              className={`${styles.headline} ${
                promotion.type === 'GIFT' ? styles.giftName : ''
              }`}
            >
              {text}
            </Text>
          )}
          {amount && (
            <Box direction="row" className={styles.amount}>
              {amount.currency && (
                <Text as="span" className={styles.minor}>
                  {amount.currency}
                </Text>
              )}
              <Text as="span" className={styles.whole}>
                {amount.whole}
              </Text>
              {(amount.fraction || amount.suffix) && (
                <Text as="span" className={styles.minor}>
                  {amount.fraction ?? amount.suffix}
                </Text>
              )}
            </Box>
          )}
          {tail && (
            <Text as="span" className={styles.tail}>
              {tail}
            </Text>
          )}
          <Box direction="row" className={styles.condition}>
            <Text as="span" className={styles.detail}>
              {detail}
            </Text>
          </Box>
        </Box>

        {isFreeDelivery ? (
          <Box className={styles.deliveryScene}>
            <img
              src="/free-delivery-rider-illustration.png"
              alt=""
              className={styles.deliveryIllustration}
            />
          </Box>
        ) : showsPhotos ? (
          <img src={mainPhoto} alt="" className={styles.mainPlate} />
        ) : (
          <Box className={styles.tagScene}>
            <DiscountTagArt
              glyph={TAG_GLYPHS[promotion.type]}
              className={styles.tagIllustration}
            />
          </Box>
        )}
        {showsPhotos && sidePhoto && (
          <img src={sidePhoto} alt="" className={styles.sidePlate} />
        )}
      </Box>
    </button>
  )
}
