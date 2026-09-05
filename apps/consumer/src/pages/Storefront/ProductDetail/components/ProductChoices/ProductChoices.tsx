import { Box } from '@nino/ds/components/Box'
import { useProductDetailFacade } from '@pages/Storefront/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'

import { ProductChoiceGroup } from './ProductChoiceGroup/ProductChoiceGroup'
import styles from './ProductChoices.module.css'

export const ProductChoices = () => {
  const { product } = useProductDetailFacade()
  if (!product || product.modifiers.length === 0) return null

  return (
    <Box className={styles.groups}>
      {product.modifiers.map((group) => (
        <ProductChoiceGroup key={group.id} group={group} />
      ))}
    </Box>
  )
}
