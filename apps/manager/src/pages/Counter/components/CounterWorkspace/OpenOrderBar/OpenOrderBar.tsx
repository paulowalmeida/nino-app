import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Text } from '@nino/ds/components/Text'
import { useCounterFacade } from '@pages/Counter/facades/useCounterFacade/useCounterFacade'
import { brl } from '@shared/utils/money/money'

import styles from './OpenOrderBar.module.css'

export const OpenOrderBar = () => {
  const { count, total, setSheet } = useCounterFacade()

  return (
    <Button
      variant="ghost"
      className={styles.openOrderBarTab}
      onClick={() => setSheet(true)}
    >
      <span className={styles.perforation} aria-hidden="true" />

      <Box direction="row" className={styles.openOrderBarBody}>
        <Text as="span" className={styles.openOrderBarCount}>
          {count} {count === 1 ? 'item' : 'itens'}
        </Text>
        <Text as="span" className={styles.openOrderBarTotal}>
          {brl(total)}
        </Text>
        <kbd className={styles.shortcut}>Enter</kbd>
      </Box>
    </Button>
  )
}
