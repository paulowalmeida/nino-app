import { Flexbox } from '@nino/ds/components/Flexbox'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { NinoMascot } from '@nino/ds/components/NinoMascot'
import { Text } from '@nino/ds/components/Text'
import type { Membership } from '@custom_types/auth/membership'
import { StoreSign } from '@compositions/StoreSign/StoreSign'
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
}: OverviewHeaderProps) => (
  <header className={`${motion.settle} ${styles.header}`}>
    <div className={styles.glow} />

    <StoreSign tenantId={tenant?.tenantId ?? null} timezone={timezone} />

    <Flexbox
      direction="column"
      align="start"
      gap={1.5}
      className={styles.headerText}
    >
      <Heading level={1} size="2xl" className={motion.deal}>
        {greetingFor(timezone)}, {firstName}
      </Heading>

      <Text size="xs" color="faint" className={styles.date}>
        {dateFor(timezone)}
      </Text>

      {tenant && (
        <a
          href={`https://${tenant.tenantSlug}.dev.nino.delivery`}
          target="_blank"
          rel="noopener noreferrer"
          title="ir para a loja"
          className={styles.store}
        >
          {tenant.tenantName}
          <Icon name="arrow-up-right" size="xs" />
        </a>
      )}
    </Flexbox>

    <NinoMascot className={`${motion.land} ${styles.mascot}`} />
  </header>
)
