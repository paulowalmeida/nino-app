import { useNavigate, useParams } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { Image } from '@nino/ds/components/Image'
import { Text } from '@nino/ds/components/Text'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import type { PublicPromotion } from '@custom_types/promotion/public-promotion.type'
import { resolveApiAssetUrl } from '@utils/api-asset-url/api-asset-url'
import { brl } from '@utils/money'

import styles from './PromotionSection.module.css'

type PackagePromotion = PublicPromotion & {
  packageGroups: NonNullable<PublicPromotion['packageGroups']>
}

const minimumListPrice = (promotion: PackagePromotion) =>
  promotion.packageGroups.reduce((total, group) => {
    const prices = group.products
      .filter(({ isAvailable }) => isAvailable)
      .map(({ price }) => price)
      .sort((first, second) => first - second)
    if (!prices.length) return total
    const selected = group.allowRepeatedProducts
      ? Array.from({ length: group.quantity }, () => prices[0])
      : prices.slice(0, group.quantity)
    return total + selected.reduce((sum, price) => sum + price, 0)
  }, 0)

export const PromotionSection = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { packageOffers } = useStorefrontFacade()

  if (!packageOffers.length) return null

  const open = (id: string) =>
    void navigate(`${slug ? `/${slug}` : ''}/promocao/${id}`)

  return (
    <Box as="section" className={styles.promotionSection}>
      <Heading level={2} size="md" className={styles.heading}>
        Promoções
      </Heading>
      <Box className={styles.promotionRail}>
        {packageOffers.map((promotion) => {
          const listPrice = minimumListPrice(promotion)
          return (
            <Button
              key={promotion.id}
              variant="ghost"
              className={styles.promotionCard}
              onClick={() => open(promotion.id)}
            >
              <Image
                src={resolveApiAssetUrl(
                  promotion.imageUrl ??
                    promotion.packageGroups[0]?.products[0]?.imageUrl
                )}
                alt=""
                className={styles.image}
                wrapperClassName={styles.imageWrap}
              />
              <Box className={styles.copy}>
                <Text as="span" className={styles.name}>
                  {promotion.name}
                </Text>
                <Box direction="row" className={styles.prices}>
                  <Text as="span" className={styles.price}>
                    {brl(promotion.value)}
                  </Text>
                  {listPrice > promotion.value && (
                    <s className={styles.listPrice}>{brl(listPrice)}</s>
                  )}
                </Box>
              </Box>
            </Button>
          )
        })}
      </Box>
    </Box>
  )
}
