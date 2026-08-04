import { Skeleton } from '@nino/ds/components/Skeleton'
import { BackLink } from '@elements/BackLink/BackLink'

import styles from '@pages/order-detail/OrderDetail.module.css'

const GHOST_ITEMS = ['first', 'second', 'third', 'fourth']
const GHOST_CARDS = ['customer', 'payment', 'timeline']

export const OrderDetailSkeleton = () => (
  <div className={styles.page}>
    <div className={styles.backBar}>
      <BackLink>Pedidos</BackLink>
    </div>

    <header className={styles.hero}>
      <div className={styles.heroText}>
        <Skeleton variant="text" className={styles.ghostEyebrow} />
        <Skeleton variant="text" className={styles.ghostNumber} />
        <Skeleton variant="text" className={styles.ghostLine} />
      </div>
      <Skeleton className={styles.ghostBadge} />
    </header>

    <div className={styles.columns}>
      <div className={styles.receipt}>
        <div className={styles.items}>
          {GHOST_ITEMS.map((item) => (
            <div key={item} className={styles.item}>
              <Skeleton variant="text" className={styles.ghostQuantity} />
              <Skeleton variant="text" className={styles.ghostItemName} />
              <Skeleton variant="text" className={styles.ghostPrice} />
            </div>
          ))}
        </div>
        <div className={styles.totals}>
          <Skeleton variant="text" className={styles.ghostTotal} />
        </div>
      </div>

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
  </div>
)
