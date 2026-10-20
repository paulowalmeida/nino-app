import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@nino/ds/components/Table'
import { Text } from '@nino/ds/components/Text'
import {
  CONSUMERS_COLUMNS,
  CONSUMERS_GHOST_ROWS,
} from '@pages/Consumers/constants/consumers.constants'

import styles from './ConsumersListSkeleton.module.css'
import listStyles from '@pages/Consumers/components/ConsumersList/ConsumersList.module.css'

export const ConsumersListSkeleton = () => (
  <>
    <Text role="status" className="sr-only">
      Carregando clientes
    </Text>

    <Box className={listStyles.listShell} aria-hidden="true">
      <Table>
        <colgroup>
          <col className={listStyles.colConsumer} />
          <col className={listStyles.colSpent} />
          <col className={listStyles.colOrders} />
          <col className={listStyles.colPoints} />
          <col className={listStyles.colSince} />
        </colgroup>
        <TableHeader>
          <TableRow className={listStyles.headRow}>
            {CONSUMERS_COLUMNS.map((label, index) => (
              <TableHead
                key={label}
                className={index > 0 ? listStyles.colHeadNumber : undefined}
              >
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {CONSUMERS_GHOST_ROWS.map((row) => (
            <TableRow key={row}>
              <TableCell>
                <Box direction="row" align="center" className={styles.who}>
                  <Skeleton variant="circle" className={styles.ghostMark} />
                  <Box className={styles.identity}>
                    <Skeleton className={styles.ghostName} />
                    <Skeleton className={styles.ghostPhone} />
                  </Box>
                </Box>
              </TableCell>

              {CONSUMERS_COLUMNS.slice(1).map((label) => (
                <TableCell key={label} className={styles.colNumber}>
                  <Skeleton className={styles.ghostCell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  </>
)
