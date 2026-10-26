import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { useProductDetailFacade } from '@pages/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'

import motion from '@styles/motion.module.css'
import styles from './ProductDetailHeader.module.css'

export const ProductDetailHeader = () => {
  const { item } = useProductDetailFacade()

  if (!item) return null

  return (
    <Box
      as="header"
      direction="row"
      align="center"
      gap={4}
      className={`${motion.deal} ${styles.head}`}
    >
      <Header
        className={styles.headText}
        level={1}
        size="2xl"
        title={item.name}
        actions={
          <Badge
            variant={item.isActive ? 'success' : 'error'}
            className={styles.headBadge}
          >
            {item.isActive ? 'No cardápio' : 'Fora do cardápio'}
          </Badge>
        }
      />
    </Box>
  )
}
