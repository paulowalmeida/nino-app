import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'

import { tableTabsListSkeletonMock } from './TableTabsListSkeleton.mock'

import styles from './TableTabsListSkeleton.module.css'

export const TableTabsListSkeleton = () => (
  <>
    <Text
      role="status"
      aria-label={tableTabsListSkeletonMock.status}
      className="sr-only"
    >
      {tableTabsListSkeletonMock.status}
    </Text>

    <Box as="ul" className={styles.list} aria-hidden="true">
      {Array.from(
        { length: tableTabsListSkeletonMock.cardCount },
        (_, index) => (
          <Box as="li" key={index} className={styles.card}>
            <Box direction="row" justify="between" align="start">
              <Box direction="column" gap={0.5}>
                <Skeleton className={styles.orderNumber} />
                <Skeleton className={styles.tableName} />
              </Box>
              <Skeleton className={styles.status} />
            </Box>
            <Box direction="row" justify="between" align="end">
              <Skeleton className={styles.itemCount} />
              <Skeleton className={styles.total} />
            </Box>
          </Box>
        )
      )}
    </Box>
  </>
)
