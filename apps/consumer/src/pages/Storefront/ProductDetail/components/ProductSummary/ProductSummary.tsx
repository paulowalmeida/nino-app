import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { useProductDetailFacade } from '@pages/Storefront/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
import { brl } from '@utils/money'

import styles from './ProductSummary.module.css'

export const ProductSummary = () => {
  const { product } = useProductDetailFacade()
  if (!product) return null

  return (
    <Box className={styles.summary}>
      <Heading level={1} className={styles.name}>
        {product.name}
      </Heading>
      {product.description && (
        <Text as="p" className={styles.description}>
          {product.description}
        </Text>
      )}
      <Text as="span" className={styles.price}>
        {brl(product.price)}
      </Text>
    </Box>
  )
}
