import { Box } from '@nino/ds/components/Box'
import { DayTally } from '@pages/Overview/components/DayTally/DayTally'
import { OverviewHeader } from '@pages/Overview/components/OverviewHeader/OverviewHeader'
import { PauseSwitch } from '@pages/Overview/components/PauseSwitch/PauseSwitch'
import { QueueBoard } from '@pages/Overview/components/QueueBoard/QueueBoard'
import { SalesTrend } from '@pages/Overview/components/SalesTrend/SalesTrend'
import { TopConsumers } from '@pages/Overview/components/TopConsumers/TopConsumers'
import { TopProducts } from '@pages/Overview/components/TopProducts/TopProducts'

import styles from './Overview.module.css'

export const Overview = () => (
  <Box className={styles.page}>
    <OverviewHeader />
    <Box className={styles.pause}>
      <PauseSwitch />
    </Box>
    <QueueBoard />
    <Box className={styles.charts}>
      <SalesTrend />
      <TopProducts />
    </Box>
    <Box className={styles.consumers}>
      <TopConsumers />
    </Box>
    <Box className={styles.tally}>
      <DayTally />
    </Box>
  </Box>
)
