import { Link } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { TableCell, TableRow } from '@nino/ds/components/Table'
import { Text } from '@nino/ds/components/Text'
import type { ConsumerRowModel } from '@pages/Consumers/types/ConsumerRowModel.type'
import { PersonMark } from '@shared/components/PersonMark/PersonMark'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './ConsumerRow.module.css'

type ConsumerRowProps = {
  consumer: ConsumerRowModel
  index: number
}

export const ConsumerRow = ({ consumer, index }: ConsumerRowProps) => (
  <TableRow
    className={`${motion.deal} ${styles.row}`}
    style={riseDelay(index * 35 + 60)}
  >
    <TableCell>
      <Box direction="row" align="center" className={styles.who}>
        <PersonMark name={consumer.name} />

        <Box className={styles.identity}>
          <Link to={consumer.id} className={styles.nameLink}>
            {consumer.name}
          </Link>
          <Text as="span" size="xs" color="faint" className={styles.phone}>
            {consumer.phoneLabel}
          </Text>
        </Box>
      </Box>
    </TableCell>

    <TableCell className={styles.colNumber}>{consumer.spentLabel}</TableCell>

    <TableCell className={styles.colNumber}>
      {consumer.ordersCount}
      {consumer.ordersLabel}
    </TableCell>

    <TableCell className={styles.colNumber}>{consumer.pointsLabel}</TableCell>

    <TableCell className={`${styles.colNumber} ${styles.since}`}>
      {consumer.sinceLabel}
    </TableCell>
  </TableRow>
)
