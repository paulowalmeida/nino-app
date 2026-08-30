import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'

import { CashActions } from './components/CashActions/CashActions'
import { CashMovements } from './components/CashMovements/CashMovements'
import { CashOpen } from './components/CashOpen/CashOpen'
import { CashSummary } from './components/CashSummary/CashSummary'
import { useCashFacade } from './facades/useCashFacade/useCashFacade'
import { CashSkeleton } from './skeletons/CashSkeleton/CashSkeleton'

import styles from './Cash.module.css'

export const Cash = () => {
  const { session, isLoadingSession, isSessionError } = useCashFacade()

  if (isLoadingSession) return <CashSkeleton />

  if (isSessionError) {
    return (
      <Box className={styles.page}>
        <Alert variant="error">
          Não deu para carregar o caixa. Tente de novo em instantes.
        </Alert>
      </Box>
    )
  }

  if (!session) {
    return (
      <Box className={styles.page}>
        <CashOpen />
      </Box>
    )
  }

  return (
    <Box direction="column" className={styles.page}>
      <CashSummary session={session} />
      <CashActions expectedAmount={session.expectedAmount} />
      <CashMovements movements={session.movements} />
    </Box>
  )
}
