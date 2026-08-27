import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Grid } from '@nino/ds/components/Grid'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { Text } from '@nino/ds/components/Text'
import { CustomerRow } from '@pages/Customers/components/CustomersList/CustomerRow/CustomerRow'
import { CUSTOMERS_COLUMNS } from '@pages/Customers/constants/customers.constants'
import { useCustomersFacade } from '@pages/Customers/facades/useCustomersFacade/useCustomersFacade'

import motion from '@styles/motion.module.css'
import styles from './CustomersList.module.css'

export const CustomersList = () => {
  const { rows, hasNextPage, loadMoreCustomers } = useCustomersFacade()

  return (
    <>
      <Grid className={`${styles.grid} ${styles.columns}`} aria-hidden>
        {CUSTOMERS_COLUMNS.map((label) => (
          <Text as="span" key={label} className={styles.columnLabel}>
            {label}
          </Text>
        ))}
      </Grid>

      <ScrollArea className={styles.listScroll}>
        <Box as="ul" className={styles.list}>
          {rows.map((row, index) => (
            <CustomerRow key={row.id} customer={row} index={index} />
          ))}
        </Box>
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
