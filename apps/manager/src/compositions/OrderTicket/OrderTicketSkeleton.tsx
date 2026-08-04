import { Card } from '@nino/ds/components/Card'
import { Skeleton } from '@nino/ds/components/Skeleton'

import styles from './OrderTicket.module.css'

/** Three item lines, the same cap the ticket shows before summarizing. */
const GHOST_ITEMS = ['first', 'second', 'third']

/**
 * The ticket's shape while it hasn't arrived yet. Shares the module with
 * OrderTicket on purpose: both read the same structure classes, so
 * changing one's header or footer moves the other along.
 *
 * The item list inherits `hidden sm:flex` from the real ticket — on
 * mobile it doesn't exist, and a skeleton that drew it would end up
 * taller than the card that will take its place.
 */
export const OrderTicketSkeleton = () => (
  <Card asChild className={styles.ticket}>
    <article>
      <header className={styles.head}>
        <Skeleton className={styles.ghostNumber} />
        <Skeleton className={styles.ghostWaited} />
        <Skeleton className={styles.ghostStatus} />
      </header>

      <div className={styles.body}>
        <Skeleton className={styles.ghostCustomer} />
        <Skeleton className={styles.ghostMeta} />
        <Skeleton className={styles.ghostSummary} />

        <div className={styles.items}>
          {GHOST_ITEMS.map((item) => (
            <div key={item} className={styles.item}>
              <Skeleton className={styles.ghostQuantity} />
              <Skeleton className={styles.ghostItemName} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.foot}>
        <div className={styles.money}>
          <Skeleton className={styles.ghostTotal} />
          <Skeleton className={styles.ghostPayment} />
        </div>
        <Skeleton className={styles.ghostAction} />
      </div>
    </article>
  </Card>
)
