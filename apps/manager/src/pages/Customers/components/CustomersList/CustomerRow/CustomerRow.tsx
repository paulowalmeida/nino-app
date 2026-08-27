import { Link } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { ListRow } from '@nino/ds/components/ListRow'
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
  <ListRow
    divider="none"
    padding={0}
    className={`${motion.deal} ${styles.item}`}
    style={riseDelay(index * 35 + 60)}
  >
    <Link to={customer.id} className={`${styles.grid} ${styles.link}`}>
      <Box direction="row" align="center" className={styles.who}>
        <PersonMark name={customer.name} />

        <Box className={styles.identity}>
          <Text as="span" className={styles.name}>
            {customer.name}
          </Text>
          <Text as="span" size="xs" color="faint" className={styles.phone}>
            {customer.phoneLabel}
          </Text>
        </Box>
      </Box>

      <Box direction="column" align="end" className={styles.stats}>
        <Box className={styles.stat}>
          <Text as="span" className={styles.statValue}>
            {customer.spentLabel}
          </Text>
        </Box>

        <Box className={styles.stat}>
          <Text as="span" className={styles.statOrders}>
            {customer.ordersCount}
          </Text>
          <Text as="span" size="xs" color="faint" className={styles.statLabel}>
            {customer.ordersLabel}
          </Text>
        </Box>

        <Box className={styles.statPoints}>
          <Text as="span" className={styles.statValue}>
            {customer.pointsLabel}
          </Text>
        </Box>

        <Text as="span" size="xs" color="faintest" className={styles.since}>
          {customer.sinceLabel}
        </Text>
      </Box>
    </Link>
  </ListRow>
)
