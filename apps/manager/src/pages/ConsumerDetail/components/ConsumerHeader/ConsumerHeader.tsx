import { Box } from '@nino/ds/components/Box'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { Header } from '@nino/ds/components/Header'
import { useConsumerDetailFacade } from '@pages/ConsumerDetail/facades/useConsumerDetailFacade/useConsumerDetailFacade'
import { consumerCadenceLabel } from '@pages/ConsumerDetail/utils/consumerCadenceLabel/consumerCadenceLabel'
import { PersonMark } from '@shared/components/PersonMark/PersonMark'

import motion from '@styles/motion.module.css'
import styles from './ConsumerHeader.module.css'

export const ConsumerHeader = () => {
  const { consumer } = useConsumerDetailFacade()

  if (!consumer) return null

  return (
    <Box
      as="header"
      direction="row"
      gap={4}
      align="center"
      className={`${motion.deal} ${styles.hero}`}
    >
      <PersonMark name={consumer.name} className={styles.mark} />

      <Box className={styles.heroText}>
        <Eyebrow>Cliente</Eyebrow>
        <Header
          level={1}
          size="xl"
          title={consumer.name}
          description={consumerCadenceLabel(
            consumer.since,
            consumer.lastOrderAt
          )}
        />
      </Box>
    </Box>
  )
}
