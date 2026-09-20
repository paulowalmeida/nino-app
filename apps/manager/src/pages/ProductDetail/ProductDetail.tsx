import { Box } from '@nino/ds/components/Box'
import { ProductDetailForm } from '@pages/ProductDetail/components/ProductDetailForm/ProductDetailForm'
import { ProductDetailHeader } from '@pages/ProductDetail/components/ProductDetailHeader/ProductDetailHeader'
import { ProductMissingNotice } from '@pages/ProductDetail/components/ProductMissingNotice/ProductMissingNotice'
import { useProductDetailFacade } from '@pages/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
import { ProductDetailSkeleton } from '@pages/ProductDetail/skeletons/ProductDetailSkeleton/ProductDetailSkeleton'
import { BackLink } from '@shared/components/BackLink/BackLink'

import styles from './ProductDetail.module.css'

export const ProductDetail = () => {
  const { isPending, isMissing, isReady } = useProductDetailFacade()

  return (
    <Box className={styles.page}>
      <Box direction="row" align="center" gap={4} className={styles.headerRow}>
        <BackLink>Cardápio</BackLink>
        {isReady && <ProductDetailHeader />}
      </Box>

      {isPending && <ProductDetailSkeleton />}
      {isMissing && <ProductMissingNotice />}
      {isReady && (
        <>
          <ProductDetailForm />
        </>
      )}
    </Box>
  )
}
