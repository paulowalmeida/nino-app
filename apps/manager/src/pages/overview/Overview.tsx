import { DayTally } from '@compositions/DayTally/DayTally'
import { OverviewHeader } from '@compositions/OverviewHeader/OverviewHeader'
import { PauseSwitch } from '@compositions/PauseSwitch/PauseSwitch'
import { QueueBoard } from '@compositions/QueueBoard/QueueBoard'
import { SalesTrend } from '@compositions/SalesTrend/SalesTrend'
import { TopProducts } from '@compositions/TopProducts/TopProducts'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { useSessionStore } from '@states/useSessionStore'

import styles from './Overview.module.css'

export const Overview = () => {
  const user = useSessionStore(({ user }) => user)
  const tenant = useCurrentTenant()

  const timezone = user?.timezone ?? null
  const firstName = user?.name.split(' ')[0] ?? ''
  const tenantId = tenant?.tenantId ?? null

  return (
    <Flexbox className={styles.page}>
      <OverviewHeader
        firstName={firstName}
        timezone={timezone}
        tenant={tenant}
      />

      <Flexbox className={styles.pause}>
        <PauseSwitch tenantId={tenantId} timezone={timezone} />
      </Flexbox>

      <QueueBoard tenantId={tenantId} />

      <Flexbox className={`${styles.charts}`} >
        <SalesTrend tenantId={tenantId} />
        <TopProducts tenantId={tenantId} />
      </Flexbox>

      <Flexbox className={styles.tally}>
        <DayTally tenantId={tenantId} timezone={timezone} />
      </Flexbox>
    </Flexbox>
  )
}
