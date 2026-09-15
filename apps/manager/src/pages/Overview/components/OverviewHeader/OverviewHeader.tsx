import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { useOverviewFacade } from '@pages/Overview/facades/useOverviewFacade/useOverviewFacade'
import { dateFor, greetingFor } from '@pages/Overview/utils/greeting'
import { storeUrlFor } from '@shared/utils/store-url/store-url'

import { StoreSign } from './StoreSign/StoreSign'

import motion from '@styles/motion.module.css'
import styles from './OverviewHeader.module.css'

export const OverviewHeader = () => {
  const { firstName, timezone, unit, storeOpen } = useOverviewFacade()
  const { isOpen } = storeOpen

  const lightStrip = isOpen
    ? `${styles.lightStrip} ${styles.lightStripOn}`
    : styles.lightStrip

  const greeting = firstName
    ? `${greetingFor(timezone)}, ${firstName}`
    : greetingFor(timezone)

  return (
    <Box as="header" className={`${motion.settle} ${styles.header}`}>
      <Text as="p" size="xs" color="faint" className={styles.eyebrow}>
        <Text as="span">{greeting}</Text>
        <span aria-hidden="true">·</span>
        <Text as="span" className={styles.date}>{dateFor(timezone)}</Text>
      </Text>

      <Box className={styles.plate}>
        <Box className={styles.identity}>
          <Heading level={1} size="2xl" className={styles.storeName}>
            {unit?.unitName ?? 'Sua loja'}
          </Heading>

          <StoreSign />
        </Box>

        {unit && (
          <a
            href={storeUrlFor(unit.unitSlug, window.location.hostname)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.visit}
          >
            Ver a loja
            <Icon name="arrow-up-right" size="xs" />
          </a>
        )}
      </Box>

      <span aria-hidden="true" className={lightStrip} />
    </Box>
  )
}
