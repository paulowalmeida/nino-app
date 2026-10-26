import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'

import summary from '../../components/ProductSummary/ProductSummary.module.css'
import hero from '../../components/ProductHero/ProductHero.module.css'
import styles from './ProductDetailSkeleton.module.css'

export const ProductDetailSkeleton = () => (
  <Box
    className={styles.productDetailSkeletonPage}
    aria-busy="true"
    aria-label="Carregando produto"
  >
    <Skeleton className={hero.hero} />
    <Box className={summary.productSummary}>
      <Skeleton className={styles.name} />
      <Skeleton className={styles.productDetailSkeletonDescription} />
      <Skeleton className={styles.price} />
    </Box>
  </Box>
)
