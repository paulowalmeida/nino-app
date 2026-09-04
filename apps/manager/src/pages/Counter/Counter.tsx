import { Box } from '@nino/ds/components/Box'
import { CounterHeader } from '@pages/Counter/components/CounterHeader/CounterHeader'
import { CounterWorkspace } from '@pages/Counter/components/CounterWorkspace/CounterWorkspace'

import styles from './Counter.module.css'

export const Counter = () => {
  return (
    <Box className={styles.page}>
      <CounterHeader />

      <CounterWorkspace />
    </Box>
  )
}
