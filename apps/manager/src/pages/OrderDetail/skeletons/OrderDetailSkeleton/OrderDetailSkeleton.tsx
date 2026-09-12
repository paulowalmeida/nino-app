import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { BackLink } from '@shared/components/BackLink/BackLink'

import styles from './OrderDetailSkeleton.module.css'

const GHOST_ITEMS = ['first', 'second', 'third', 'fourth']
const GHOST_CARDS = ['consumer', 'payment', 'timeline']

export const OrderDetailSkeleton = () => (
  <Box className={styles.page}>
    <Box className={styles.backBar}>
      <BackLink>Pedidos</BackLink>
    </Box>

    <p role="status" className="sr-only">
      Carregando detalhes do pedido
    </p>

    <header className={styles.hero}>
      <Box className={styles.heroText}>
        <Skeleton variant="text" className={styles.ghostEyebrow} />
        <Skeleton variant="text" className={styles.ghostNumber} />
        <Skeleton variant="text" className={styles.ghostLine} />
      </Box>
      <Skeleton className={styles.ghostBadge} />
    </header>

    <div className={styles.columns}>
      <Box className={styles.receipt}>
        <Box as="ul" className={styles.items}>
          {GHOST_ITEMS.map((item) => (
            <div key={item} className={styles.item}>
              <Skeleton variant="text" className={styles.ghostQuantity} />
              <Skeleton variant="text" className={styles.ghostItemName} />
              <Skeleton variant="text" className={styles.ghostPrice} />
            </div>
          ))}
        </Box>
        <div className={styles.totals}>
          <Skeleton variant="text" className={styles.ghostTotal} />
        </div>
      </Box>

      <div className={styles.aside}>
        {GHOST_CARDS.map((card) => (
          <div key={card} className={styles.block}>
            <Skeleton variant="text" className={styles.ghostEyebrow} />
            <Skeleton variant="text" className={styles.ghostLine} />
            <Skeleton variant="text" className={styles.ghostLineShort} />
          </div>
        ))}
      </div>
    </div>
  </Box>
)
