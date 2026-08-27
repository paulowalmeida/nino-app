import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { useProductDetailFacade } from '@pages/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'

import motion from '@styles/motion.module.css'
import styles from './ProductDetailHeader.module.css'

export const ProductDetailHeader = () => {
  const { item } = useProductDetailFacade()

  if (!item) return null

  return (
    <Box as="header" className={`${motion.settle} ${styles.head}`}>
      <Box className={styles.headText}>
        <Heading level={1} size="2xl" className={styles.name}>
          {item.name}
        </Heading>
      </Box>
      <Badge
        variant={item.isActive ? 'success' : 'error'}
        className={styles.headBadge}
      >
        {item.isActive ? 'No cardápio' : 'Fora do cardápio'}
      </Badge>
    </Box>
  )
}
