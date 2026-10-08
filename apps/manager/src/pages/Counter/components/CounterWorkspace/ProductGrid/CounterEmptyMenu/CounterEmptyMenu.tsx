import { Link } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Icon } from '@nino/ds/components/Icon'
import { NinoMascot } from '@nino/ds/components/NinoMascot'
import { Text } from '@nino/ds/components/Text'
import { COUNTER_CAPABILITIES } from '@pages/Counter/constants/counter.constants'

import styles from './CounterEmptyMenu.module.css'

export const CounterEmptyMenu = () => {
  return (
    <Box className={styles.counterEmptyMenu}>
      <EmptyState
        size="md"
        illustration={<NinoMascot />}
        title="O balcão está pronto, falta o cardápio"
        action={
          <Button asChild>
            <Link to="../produtos/novo" relative="path">
              Cadastrar primeiro produto
            </Link>
          </Button>
        }
      >
        Assim que houver um produto ativo, ele aparece aqui para você vender.
      </EmptyState>

      <Box as="section" aria-label="O que dá para fazer no balcão">
        <Text size="sm" weight="semibold" color="strong">
          O que dá para fazer aqui
        </Text>
        <Box as="ul" className={styles.capabilities}>
          {COUNTER_CAPABILITIES.map(({ icon, title, description }) => (
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
