import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@nino/ds/components/Table'
import { ConsumerRow } from '@pages/Consumers/components/ConsumersList/ConsumerRow/ConsumerRow'
import { CONSUMERS_COLUMNS } from '@pages/Consumers/constants/consumers.constants'
import { useConsumersFacade } from '@pages/Consumers/facades/useConsumersFacade/useConsumersFacade'

import motion from '@styles/motion.module.css'
import styles from './ConsumersList.module.css'

export const ConsumersList = () => {
  const { rows, hasNextPage, loadMoreConsumers } = useConsumersFacade()

  return (
    <>
      <Box className={styles.listShell}>
        <Table>
          <colgroup>
            <col className={styles.colConsumer} />
            <col className={styles.colSpent} />
            <col className={styles.colOrders} />
            <col className={styles.colCashback} />
            <col className={styles.colSince} />
          </colgroup>
          <TableHeader>
            <TableRow className={styles.headRow}>
              {CONSUMERS_COLUMNS.map((label, index) => (
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
              <ConsumerRow key={row.id} consumer={row} index={index} />
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
            onClick={loadMoreConsumers}
          >
            Carregar mais
          </Button>
        </Box>
      )}
    </>
  )
}
