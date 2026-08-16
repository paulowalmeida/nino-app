import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import type { Membership } from '@custom_types/auth/membership'
import { StoreSign } from '@compositions/StoreSign/StoreSign'
import { useStoreOpen } from '@hooks/store/useStoreOpen'
import { dateFor, greetingFor } from '@utils/greeting'

import styles from './OverviewHeader.module.css'
import motion from '@styles/motion.module.css'

type OverviewHeaderProps = {
  firstName: string
  timezone: string | null
  tenant: Membership | null
}

export const OverviewHeader = ({
  firstName,
  timezone,
  tenant,
}: OverviewHeaderProps) => {
  const { isOpen } = useStoreOpen(tenant?.tenantId ?? null, timezone)

  const lightStrip = isOpen
    ? `${styles.lightStrip} ${styles.lightStripOn}`
    : styles.lightStrip

  const greeting = firstName
    ? `${greetingFor(timezone)}, ${firstName}`
    : greetingFor(timezone)

  return (
    <header className={`${motion.settle} ${styles.header}`}>
      <Text as="p" size="xs" color="faint" className={styles.eyebrow}>
        <span>{greeting}</span>
        <span aria-hidden="true">·</span>
        <span className={styles.date}>{dateFor(timezone)}</span>
      </Text>

      <div className={styles.plate}>
        <div className={styles.identity}>
          <Heading level={1} size="2xl" className={styles.storeName}>
            {tenant?.tenantName ?? 'Sua loja'}
          </Heading>

          <StoreSign
            tenantId={tenant?.tenantId ?? null}
            timezone={timezone}
          />
        </div>

        {tenant && (
          <a
            href={`https://${tenant.tenantSlug}.dev.nino.delivery`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.visit}
          >
            Ver a loja
            <Icon name="arrow-up-right" size="xs" />
          </a>
        )}
      </div>

      <div aria-hidden="true" className={lightStrip} />
    </header>
  )
}
