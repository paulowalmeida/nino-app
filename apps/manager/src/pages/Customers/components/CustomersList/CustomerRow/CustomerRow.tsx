import { Link } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { TableCell, TableRow } from '@nino/ds/components/Table'
import { Text } from '@nino/ds/components/Text'
import type { CustomerRowModel } from '@pages/Customers/types/CustomerRowModel.type'
import { PersonMark } from '@shared/components/PersonMark/PersonMark'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './CustomerRow.module.css'

type CustomerRowProps = {
  customer: CustomerRowModel
  index: number
}

export const CustomerRow = ({ customer, index }: CustomerRowProps) => (
  <TableRow
    className={`${motion.deal} ${styles.row}`}
    style={riseDelay(index * 35 + 60)}
  >
    <TableCell>
      <Box direction="row" align="center" className={styles.who}>
        <PersonMark name={customer.name} />

        <Box className={styles.identity}>
          <Link to={customer.id} className={styles.nameLink}>
            {customer.name}
          </Link>
          <Text as="span" size="xs" color="faint" className={styles.phone}>
            {customer.phoneLabel}
          </Text>
        </Box>
      </Box>
    </TableCell>

    <TableCell className={styles.colNumber}>{customer.spentLabel}</TableCell>

    <TableCell className={styles.colNumber}>
      {customer.ordersCount}
      {customer.ordersLabel}
    </TableCell>

    <TableCell className={styles.colNumber}>{customer.pointsLabel}</TableCell>

    <TableCell className={`${styles.colNumber} ${styles.since}`}>
      {customer.sinceLabel}
    </TableCell>
  </TableRow>
)
