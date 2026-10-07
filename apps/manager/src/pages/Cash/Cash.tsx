import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { NinoMascot } from '@nino/ds/components/NinoMascot'

import { CashActions } from './components/CashActions/CashActions'
import { CashDateSelector } from './components/CashDateSelector/CashDateSelector'
import { CashMovements } from './components/CashMovements/CashMovements'
import { CashOpen } from './components/CashOpen/CashOpen'
import { CashSummary } from './components/CashSummary/CashSummary'
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
        <CashDateSelector />

        {!session && isToday && <CashOpen />}

        {!session && !isToday && (
          <EmptyState
            size="md"
            illustration={<NinoMascot />}
            title="Nenhum caixa nesse dia"
          >
            Ninguém abriu o caixa nessa data. Escolha outro dia para ver o
            balanço.
          </EmptyState>
        )}

        {session && (
          <>
            <CashSummary session={session} />
            {isToday && <CashActions expectedAmount={session.expectedAmount} />}
          </>
        )}
      </Box>

      {session && <CashMovements movements={session.movements} />}
    </Box>
  )
}
