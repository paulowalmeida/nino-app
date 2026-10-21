import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Header } from '@nino/ds/components/Header'
import { NinoMascot } from '@nino/ds/components/NinoMascot'

import { CashDateSelector } from './components/CashDateSelector/CashDateSelector'
import { CashOpen } from './components/CashOpen/CashOpen'
import { CashSessionTabs } from './components/CashSessionTabs/CashSessionTabs'
import { useCashFacade } from './facades/useCashFacade/useCashFacade'
import { CashSkeleton } from './skeletons/CashSkeleton/CashSkeleton'

import motion from '@styles/motion.module.css'
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
        <Header
          mb={{ mobile: 0, desktop: 4 }}
          className={`${motion.deal} shrink-0`}
          title="Caixa"
          accent="Caixa"
          description={
            'Aqui você consegue acompanhar o fluxo de caixa do dia, abrir e fechar o caixa, além de conferir os detalhes das movimentações.'
          }
        />

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

      </Box>

      {session && <CashSessionTabs session={session} isToday={isToday} />}
    </Box>
  )
}
