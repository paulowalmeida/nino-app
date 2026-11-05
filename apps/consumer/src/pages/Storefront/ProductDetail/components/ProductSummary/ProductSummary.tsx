import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { useProductDetailFacade } from '@pages/Storefront/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
import { minimumProductPrice } from '@pages/Storefront/utils/minimum-product-price/minimum-product-price'
import { brl } from '@utils/money'

import styles from './ProductSummary.module.css'

type ProductSummaryProps = {
  compact?: boolean
}

export const ProductSummary = ({ compact = false }: ProductSummaryProps) => {
  const { product } = useProductDetailFacade()
  if (!product) return null

  const identity = (
    <Box className={styles.productIdentity}>
      <Heading level={1} className={styles.name}>
        {product.name}
      </Heading>
      <Text as="span" className={styles.price}>
        {product.pricingType === 'COMPOSED' ? 'A partir de ' : ''}
        {brl(minimumProductPrice(product))}
      </Text>
    </Box>
  )

  if (compact) return identity

  return (
    <Box className={styles.productSummary}>
      {product.description && (
        <Text as="p" className={styles.productSummaryDescription}>
          {product.description}
        </Text>
      )}
    </Box>
  )
}
