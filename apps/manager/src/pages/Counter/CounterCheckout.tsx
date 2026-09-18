import { useNavigate } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { COUNTER_STEP_COPY } from '@pages/Counter/constants/counter.constants'

import { SalePanel } from './components/CounterWorkspace/SalePanel/SalePanel'
import { useCounterFacade } from './facades/useCounterFacade/useCounterFacade'

import styles from './CounterCheckout.module.css'

export const CounterCheckout = () => {
  const navigate = useNavigate()
  const { count, step, setSheet } = useCounterFacade()

  const goBackToCounter = () => {
    setSheet(false)
    navigate('..')
  }

  return (
    <Box className={styles.page}>
      <Box as="header" direction="column" className={styles.checkoutHeader}>
        <Box direction="row" align="center" gap={2}>
          <Button
            type="button"
            variant="ghost"
            aria-label="Voltar para os produtos"
            onClick={goBackToCounter}
            className={styles.checkoutBack}
          >
            <Icon name="arrow-left" size="sm" />
          </Button>
          <Heading level={1} size="md" className={styles.checkoutTitle}>
            Fechar pedido
          </Heading>
          <Text size="sm" color="muted" className={styles.checkoutCount}>
            {count} {count === 1 ? 'item' : 'itens'}
          </Text>
        </Box>
        <Text size="xs" color="muted" className={styles.checkoutStep}>
          <Text as="span" size="xs" weight="bold" color="brand-strong">
            {COUNTER_STEP_COPY[step].title}
          </Text>{' '}
          {COUNTER_STEP_COPY[step].hint}
        </Text>
      </Box>
      <SalePanel bare />
    </Box>
  )
}
