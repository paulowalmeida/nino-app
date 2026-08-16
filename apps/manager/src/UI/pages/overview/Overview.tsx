import { DayTally } from '@organisms/DayTally/DayTally'
import { OverviewHeader } from '@organisms/OverviewHeader/OverviewHeader'
import { PauseSwitch } from '@organisms/PauseSwitch/PauseSwitch'
import { QueueBoard } from '@organisms/QueueBoard/QueueBoard'
import { SalesTrend } from '@organisms/SalesTrend/SalesTrend'
import { TopCustomers } from '@organisms/TopCustomers/TopCustomers'
import { TopProducts } from '@organisms/TopProducts/TopProducts'
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

      <Flexbox className={styles.customers}>
        <TopCustomers tenantId={tenantId} />
      </Flexbox>

      <Flexbox className={styles.tally}>
        <DayTally tenantId={tenantId} timezone={timezone} />
      </Flexbox>
    </Flexbox>
  )
}
