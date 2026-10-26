import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Icon } from '@nino/ds/components/Icon'
import { NinoMascot } from '@nino/ds/components/NinoMascot'
import { Text } from '@nino/ds/components/Text'
import { CONSUMERS_CAPABILITIES } from '@pages/Consumers/constants/consumers.constants'
import { consumersEmptyMessage } from '@pages/Consumers/utils/consumersEmptyMessage/consumersEmptyMessage'

import motion from '@styles/motion.module.css'
import styles from './ConsumersEmptyState.module.css'

type ConsumersEmptyStateProps = {
  search: string
}

export const ConsumersEmptyState = ({ search }: ConsumersEmptyStateProps) => {
  if (search) {
    return (
      <EmptyState className={`${motion.unroll} ${styles.searchEmpty}`}>
        {consumersEmptyMessage(search)}
      </EmptyState>
    )
  }

  return (
    <Box className={styles.consumersEmptyState}>
      <EmptyState
        size="md"
        illustration={<NinoMascot />}
        title="Nenhum cliente ainda"
        className={motion.unroll}
      >
        {consumersEmptyMessage(search)}
      </EmptyState>

      <Box as="section" aria-label="O que dá para fazer nos clientes">
        <Text size="sm" weight="semibold" color="strong">
          O que dá para fazer aqui
        </Text>
        <Box as="ul" className={styles.capabilities}>
          {CONSUMERS_CAPABILITIES.map(({ icon, title, description }) => (
            <Box as="li" key={title} direction="row" gap={3} align="start">
              <Icon name={icon} size="md" />
              <Box direction="column" gap={0.5}>
                <Text size="sm" weight="semibold" color="strong">
                  {title}
                </Text>
                <Text size="sm" color="muted">
                  {description}
                </Text>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
