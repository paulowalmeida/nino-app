import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'

import { tableTabsListSkeletonMock } from './TableTabsListSkeleton.mock'

import styles from './TableTabsListSkeleton.module.css'

export const TableTabsListSkeleton = ({
  count = tableTabsListSkeletonMock.cardCount,
}: {
  count?: number
}) => (
  <>
    <Text
      role="status"
      aria-label={tableTabsListSkeletonMock.status}
      className="sr-only"
    >
      {tableTabsListSkeletonMock.status}
    </Text>

    <Box
      as="ul"
      className={styles.tableTabsListSkeletonList}
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <Box as="li" key={index} className={styles.tableTabsListSkeletonCard}>
          <Box direction="row" justify="between" align="start">
            <Box direction="column" gap={0.5}>
              <Skeleton className={styles.orderNumber} />
              <Skeleton className={styles.tableName} />
            </Box>
            <Skeleton className={styles.tableTabsListSkeletonStatus} />
          </Box>
          <Box direction="row" justify="between" align="end">
            <Skeleton className={styles.itemCount} />
            <Skeleton className={styles.tableTabsListSkeletonTotal} />
          </Box>
        </Box>
      ))}
    </Box>
  </>
)
