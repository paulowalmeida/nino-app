import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'

import { CashDateSelector } from './components/CashDateSelector/CashDateSelector'
import { CashEmptyDay } from './components/CashEmptyDay/CashEmptyDay'
import { CashHeader } from './components/CashHeader/CashHeader'
import { CashOpen } from './components/CashOpen/CashOpen'
import { CashSessionTabs } from './components/CashSessionTabs/CashSessionTabs'
import { useCashFacade } from './facades/useCashFacade/useCashFacade'
import { CashSkeleton } from './skeletons/CashSkeleton/CashSkeleton'

import styles from './Cash.module.css'

export const Cash = () => {
  const { session, isLoadingSession, isSessionError, isToday } = useCashFacade()

  if (isLoadingSession) return <CashSkeleton />

  if (isSessionError) {
    return (
      <Box className={styles.cashPage}>
        <Box className={styles.cashControls}>
          <Alert variant="error">
            Não deu para carregar o caixa. Tente de novo em instantes.
          </Alert>
        </Box>
      </Box>
    )
  }

  return (
    <Box direction="column" className={styles.cashPage}>
      <Box className={styles.cashControls}>
        <CashHeader />

        <CashDateSelector />

        {!session && isToday && <CashOpen />}

        {!session && !isToday && <CashEmptyDay />}
      </Box>

      {session && <CashSessionTabs />}
    </Box>
  )
}
