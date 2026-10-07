import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { Skeleton } from '@nino/ds/components/Skeleton'

import styles from './OrderTicketSkeleton.module.css'
import ticketStyles from '@shared/components/OrderTicket/OrderTicket.module.css'

const GHOST_ITEMS = ['first', 'second', 'third']

export const OrderTicketSkeleton = () => (
  <Card asChild className={ticketStyles.ticket}>
    <article>
      <Box as="header" className={ticketStyles.head}>
        <Skeleton className={styles.ghostNumber} />
        <Skeleton className={styles.ghostWaited} />
        <Skeleton className={styles.ghostStatus} />
      </Box>

      <Box className={ticketStyles.orderTicketBody}>
        <Skeleton className={styles.ghostConsumer} />
        <Skeleton className={styles.ghostMeta} />
        <Skeleton className={styles.ghostSummary} />

        <Box as="ul" className={ticketStyles.items}>
          {GHOST_ITEMS.map((item) => (
            <Box as="li" key={item} className={ticketStyles.orderTicketItem}>
              <Skeleton className={styles.ghostQuantity} />
              <Skeleton className={styles.ghostItemName} />
            </Box>
          ))}
        </Box>
      </Box>

      <Box as="footer" className={ticketStyles.foot}>
        <Box direction="column">
          <Skeleton className={styles.ghostTotal} />
          <Skeleton className={styles.ghostPayment} />
        </Box>
        <Skeleton className={styles.ghostAction} />
      </Box>
    </article>
  </Card>
)
