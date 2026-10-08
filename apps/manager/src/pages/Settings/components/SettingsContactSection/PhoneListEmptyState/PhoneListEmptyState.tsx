import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Icon } from '@nino/ds/components/Icon'
import { NinoMascot } from '@nino/ds/components/NinoMascot'
import { Text } from '@nino/ds/components/Text'
import { PHONE_LIST_CAPABILITIES } from '@pages/Settings/constants/settings.constants'

import styles from './PhoneListEmptyState.module.css'

export const PhoneListEmptyState = () => {
  return (
    <Box className={styles.phoneListEmptyState}>
      <EmptyState
        size="md"
        illustration={<NinoMascot />}
        title="Nenhum telefone cadastrado"
      >
        Adicione um número para que os clientes saibam como falar com a loja.
      </EmptyState>

      <Box as="section" aria-label="O que dá para fazer nos contatos">
        <Text size="sm" weight="semibold" color="strong">
          O que dá para fazer aqui
        </Text>
        <Box as="ul" className={styles.capabilities}>
          {PHONE_LIST_CAPABILITIES.map(({ icon, title, description }) => (
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
