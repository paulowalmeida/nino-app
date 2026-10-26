import { Box } from '@nino/ds/components/Box'
import { Tabs } from '@nino/ds/components/Tabs'

import { useCashFacade } from '../../facades/useCashFacade/useCashFacade'
import { CashActions } from '../CashActions/CashActions'
import { CashMovements } from '../CashMovements/CashMovements'
import { CashSummary } from '../CashSummary/CashSummary'

import styles from './CashSessionTabs.module.css'

export const CashSessionTabs = () => {
  const { session, isToday } = useCashFacade()

  if (!session) return null

  return (
    <Tabs
      className={styles.cashSessionTabs}
      fullWidth={{ mobile: true, tablet: false }}
      tabs={[
        {
          value: 'summary',
          label: 'Resumo',
          content: (
            <Box direction="column" className={styles.summaryPanel}>
              <CashSummary />
              {isToday && <CashActions />}
            </Box>
          ),
        },
        {
          value: 'movements',
          label: `Movimentações · ${session.movements.length}`,
          content: (
            <Box className={styles.movementsPanel}>
              <CashMovements />
            </Box>
          ),
        },
      ]}
    />
  )
}
