import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { CUSTOMERS_GHOST_ROWS } from '@pages/Customers/constants/customers.constants'

import styles from './CustomersListSkeleton.module.css'

export const CustomersListSkeleton = () => (
  <Box direction="column" gap={2} mt={6}>
    <p role="status" className="sr-only">
      Carregando clientes
    </p>

    {CUSTOMERS_GHOST_ROWS.map((row) => (
      <div key={row} className={`${styles.grid} ${styles.ghostRow}`}>
        <span className={styles.who}>
          <Skeleton variant="circle" className={styles.ghostMark} />
          <span className={styles.identity}>
            <Skeleton className={styles.ghostName} />
            <Skeleton className={styles.ghostPhone} />
          </span>
        </span>

        <span className={styles.stats}>
          <Skeleton className={styles.ghostStat} />
          <Skeleton className={styles.ghostStat} />
          <Skeleton className={styles.ghostStatDesktop} />
          <Skeleton className={styles.ghostStatDesktop} />
        </span>
      </div>
    ))}
  </Box>
)
