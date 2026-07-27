import { DayTally } from '@compositions/DayTally'
import { PauseSwitch } from '@compositions/PauseSwitch'
import { QueueBoard } from '@compositions/QueueBoard'
import { SalesTrend } from '@compositions/SalesTrend'
import { TopProducts } from '@compositions/TopProducts'
import { StoreSign } from '@compositions/StoreSign'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useSessionStore } from '@states/useSessionStore'

import styles from './Overview.module.css'
import motion from '@styles/motion.module.css'

const resolveZone = (timezone: string | null): string =>
  timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone

const greetingFor = (timezone: string | null): string => {
  const hour = Number(
    new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      hour12: false,
      timeZone: resolveZone(timezone),
    })
  )
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

const dateFor = (timezone: string | null): string =>
  new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: resolveZone(timezone),
  }).format(new Date())

export const Overview = () => {
  const user = useSessionStore(({ user }) => user)
  const tenant = useCurrentTenant()

  const timezone = user?.timezone ?? null
  const firstName = user?.name.split(' ')[0] ?? ''
  const tenantId = tenant?.tenantId ?? null

  return (
    <div className={styles.page}>
      <header className={`${motion.settle} ${styles.header}`}>
        <div className={styles.glow} />
        <div className={styles.headerText}>
          <p className={`${motion.deal} ${styles.greeting}`}>
            {greetingFor(timezone)}
          </p>
          <h1 className={`${motion.deal} ${styles.title}`}>{firstName}</h1>
          <div className={styles.meta}>
            <p className={styles.date}>{dateFor(timezone)}</p>

            {tenant && (
              <a
                href={`https://${tenant.tenantSlug}.dev.nino.delivery`}
                target="_blank"
                rel="noopener noreferrer"
                title="ir para a loja"
                className={styles.store}
              >
                {tenant.tenantName}
              </a>
            )}
          </div>

          <StoreSign tenantId={tenantId} timezone={timezone} />
        </div>
        <img
          src="/mascot-manager.svg"
          alt=""
          aria-hidden="true"
          className={`${motion.land} ${styles.mascot}`}
        />
      </header>

      <div className={styles.pause}>
        <PauseSwitch tenantId={tenantId} timezone={timezone} />
      </div>

      <QueueBoard tenantId={tenantId} />

      <div className={styles.charts}>
        <SalesTrend tenantId={tenantId} />
        <TopProducts tenantId={tenantId} />
      </div>

      <div className={styles.tally}>
        <DayTally tenantId={tenantId} timezone={timezone} />
      </div>
    </div>
  )
}
