import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@nino/ds/components/Table'
import { CUSTOMERS_GHOST_ROWS } from '@pages/Customers/constants/customers.constants'

import styles from './CustomersListSkeleton.module.css'

export const CustomersListSkeleton = () => (
  <Box mt={6}>
    <p role="status" className="sr-only">
      Carregando clientes
    </p>

    <Table>
      <TableBody>
        {CUSTOMERS_GHOST_ROWS.map((row) => (
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

            <TableCell className={styles.colNumber}>
              <Skeleton className={styles.ghostCell} />
            </TableCell>
            <TableCell className={styles.colNumber}>
              <Skeleton className={styles.ghostCell} />
            </TableCell>
            <TableCell className={styles.colNumber}>
              <Skeleton className={styles.ghostCell} />
            </TableCell>
            <TableCell className={styles.colNumber}>
              <Skeleton className={styles.ghostCell} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
)
