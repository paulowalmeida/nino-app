import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
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
      <ScrollArea className={styles.listScroll}>
        <Table>
          <TableHeader className={styles.stickyHeader}>
            <TableRow>
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
      </ScrollArea>

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
