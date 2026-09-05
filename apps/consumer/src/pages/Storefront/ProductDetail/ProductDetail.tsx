import { Box } from '@nino/ds/components/Box'

import { ProductAddBar } from './components/ProductAddBar/ProductAddBar'
import { ProductChoices } from './components/ProductChoices/ProductChoices'
import { ProductHero } from './components/ProductHero/ProductHero'
import { ProductNotes } from './components/ProductNotes/ProductNotes'
import { ProductReplacementDialog } from './components/ProductReplacementDialog/ProductReplacementDialog'
import { ProductSummary } from './components/ProductSummary/ProductSummary'
import { ProductUnavailable } from './components/ProductUnavailable/ProductUnavailable'
import { useProductDetailFacade } from './facades/useProductDetailFacade/useProductDetailFacade'
import { ProductDetailSkeleton } from './skeletons/ProductDetailSkeleton/ProductDetailSkeleton'
import styles from './ProductDetail.module.css'

export const ProductDetail = () => {
  const { product, isProductPending, isProductError, isStorePending } =
    useProductDetailFacade()

  if (isStorePending || isProductPending) return <ProductDetailSkeleton />
  if (isProductError || !product) return <ProductUnavailable />

  return (
    <Box className={styles.page}>
      <ProductHero />
      <ProductSummary />
      <ProductChoices />
      <ProductNotes />
      <ProductAddBar />
      <ProductReplacementDialog />
    </Box>
  )
}
