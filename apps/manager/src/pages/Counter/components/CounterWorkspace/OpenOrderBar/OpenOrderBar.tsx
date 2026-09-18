import { useNavigate } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { useCounterFacade } from '@pages/Counter/facades/useCounterFacade/useCounterFacade'
import { brl } from '@shared/utils/money/money'

import styles from './OpenOrderBar.module.css'

export const OpenOrderBar = () => {
  const { count, total, setSheet } = useCounterFacade()
  const navigate = useNavigate()

  return (
    <Button
      variant="ghost"
      className={styles.tab}
      onClick={() => {
        setSheet(true)
        navigate('fechar')
      }}
    >
      <span className={styles.perforation} aria-hidden="true" />

      <Box direction="row" className={styles.body}>
        <Text as="span" className={styles.count}>
          {count} {count === 1 ? 'item' : 'itens'}
        </Text>
        <Text as="span" className={styles.total}>
          {brl(total)}
        </Text>
        <kbd className={styles.shortcut}>Enter</kbd>
        <Box className={styles.hint} aria-hidden="true">
          <Icon name="arrow-up" size="sm" />
        </Box>
      </Box>
    </Button>
  )
}
