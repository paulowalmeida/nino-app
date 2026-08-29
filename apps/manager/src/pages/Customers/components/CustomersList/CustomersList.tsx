import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@nino/ds/components/Table'
import { CustomerRow } from '@pages/Customers/components/CustomersList/CustomerRow/CustomerRow'
import { CUSTOMERS_COLUMNS } from '@pages/Customers/constants/customers.constants'
import { useCustomersFacade } from '@pages/Customers/facades/useCustomersFacade/useCustomersFacade'

import motion from '@styles/motion.module.css'
import styles from './CustomersList.module.css'

export const CustomersList = () => {
  const { rows, hasNextPage, loadMoreCustomers } = useCustomersFacade()

  return (
    <>
      <Box className={styles.listShell}>
        <Table>
          <colgroup>
            <col className={styles.colCustomer} />
            <col className={styles.colSpent} />
            <col className={styles.colOrders} />
            <col className={styles.colPoints} />
            <col className={styles.colSince} />
          </colgroup>
          <TableHeader>
            <TableRow className={styles.headRow}>
              {CUSTOMERS_COLUMNS.map((label, index) => (
                <TableHead
                  key={label}
                  className={index > 0 ? styles.colHeadNumber : undefined}
                >
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row, index) => (
              <CustomerRow key={row.id} customer={row} index={index} />
            ))}
          </TableBody>
        </Table>
      </Box>

      {hasNextPage && (
        <Box direction="row" justify="center" className={styles.more}>
          <Button
            variant="outline"
            size="sm"
            className={motion.press}
            onClick={loadMoreCustomers}
          >
            Carregar mais
          </Button>
        </Box>
      )}
    </>
  )
}
