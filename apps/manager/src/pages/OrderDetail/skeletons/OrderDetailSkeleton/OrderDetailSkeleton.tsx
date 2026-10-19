import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { BackLink } from '@shared/components/BackLink/BackLink'

import styles from './OrderDetailSkeleton.module.css'

const GHOST_ITEMS = ['first', 'second', 'third', 'fourth']
const GHOST_CARDS = ['consumer', 'payment', 'timeline']

export const OrderDetailSkeleton = () => (
  <Box className={styles.orderDetailSkeletonPage}>
    <Box className={styles.backBar}>
      <BackLink>Pedidos</BackLink>
    </Box>

    <Text role="status" className="sr-only">
      Carregando detalhes do pedido
    </Text>

    <Box as="header" className={styles.hero}>
      <Box className={styles.heroText}>
        <Skeleton variant="text" className={styles.ghostEyebrow} />
        <Skeleton variant="text" className={styles.ghostNumber} />
        <Skeleton variant="text" className={styles.ghostLine} />
      </Box>
      <Skeleton className={styles.ghostBadge} />
    </Box>

    <Box className={styles.columns}>
      <Box className={styles.receipt}>
        <Box as="ul" className={styles.items}>
          {GHOST_ITEMS.map((item) => (
            <Box key={item} className={styles.orderDetailSkeletonItem}>
              <Skeleton variant="text" className={styles.ghostQuantity} />
              <Skeleton variant="text" className={styles.ghostItemName} />
              <Skeleton variant="text" className={styles.ghostPrice} />
            </Box>
          ))}
        </Box>
        <Box className={styles.totals}>
          <Skeleton variant="text" className={styles.ghostTotal} />
        </Box>
      </Box>

      <Box className={styles.aside}>
        {GHOST_CARDS.map((card) => (
          <Box key={card} className={styles.block}>
            <Skeleton variant="text" className={styles.ghostEyebrow} />
            <Skeleton variant="text" className={styles.ghostLine} />
            <Skeleton variant="text" className={styles.ghostLineShort} />
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
)
