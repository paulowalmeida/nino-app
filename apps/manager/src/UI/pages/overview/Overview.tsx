import { DayTally } from '@organisms/DayTally/DayTally'
import { OverviewHeader } from '@organisms/OverviewHeader/OverviewHeader'
import { PauseSwitch } from '@organisms/PauseSwitch/PauseSwitch'
import { QueueBoard } from '@organisms/QueueBoard/QueueBoard'
import { SalesTrend } from '@organisms/SalesTrend/SalesTrend'
import { TopCustomers } from '@organisms/TopCustomers/TopCustomers'
import { TopProducts } from '@organisms/TopProducts/TopProducts'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { Box } from '@nino/ds/components/Box'
import { useSessionStore } from '@states/useSessionStore'

import styles from './Overview.module.css'

export const Overview = () => {
  const user = useSessionStore(({ user }) => user)
  const tenant = useCurrentTenant()

  const timezone = user?.timezone ?? null
  const firstName = user?.name.split(' ')[0] ?? ''
  const tenantId = tenant?.tenantId ?? null

  return (
    <Box className={styles.page}>
      <OverviewHeader
        firstName={firstName}
        timezone={timezone}
        tenant={tenant}
      />

      <Box className={styles.pause}>
        <PauseSwitch tenantId={tenantId} timezone={timezone} />
      </Box>

      <QueueBoard tenantId={tenantId} />

      <Box className={`${styles.charts}`} >
        <SalesTrend tenantId={tenantId} />
        <TopProducts tenantId={tenantId} />
      </Box>

      <Box className={styles.customers}>
        <TopCustomers tenantId={tenantId} />
      </Box>

      <Box className={styles.tally}>
        <DayTally tenantId={tenantId} timezone={timezone} />
      </Box>
    </Box>
  )
}
