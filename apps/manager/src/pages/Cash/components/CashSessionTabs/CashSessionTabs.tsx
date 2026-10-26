import { Box } from '@nino/ds/components/Box'
import { Tabs } from '@nino/ds/components/Tabs'
import type { CashSession } from '@shared/types/cash/cash-session.type'

import { CashActions } from '../CashActions/CashActions'
import { CashMovements } from '../CashMovements/CashMovements'
import { CashSummary } from '../CashSummary/CashSummary'

import styles from './CashSessionTabs.module.css'

export type CashSessionTabsProps = {
  session: CashSession
  isToday: boolean
}

export const CashSessionTabs = ({ session, isToday }: CashSessionTabsProps) => (
  <Tabs
    className={styles.cashSessionTabs}
    fullWidth={{ mobile: true, tablet: false }}
    tabs={[
      {
        value: 'summary',
        label: 'Resumo',
        content: (
          <Box direction="column" className={styles.summaryPanel}>
            <CashSummary session={session} />
            {isToday && <CashActions expectedAmount={session.expectedAmount} />}
          </Box>
        ),
      },
      {
        value: 'movements',
        label: `Movimentações · ${session.movements.length}`,
        content: (
          <Box className={styles.movementsPanel}>
            <CashMovements movements={session.movements} />
          </Box>
        ),
      },
    ]}
  />
)
