import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { ReportsContent } from '@pages/Reports/components/ReportsContent/ReportsContent'
import { ReportsNotice } from '@pages/Reports/components/ReportsNotice/ReportsNotice'
import { ReportsPeriodControls } from '@pages/Reports/components/ReportsPeriodControls/ReportsPeriodControls'
import { useReportsFacade } from '@pages/Reports/facades/useReportsFacade/useReportsFacade'
import { ReportsSkeleton } from '@pages/Reports/skeletons/ReportsSkeleton/ReportsSkeleton'

import motion from '@styles/motion.module.css'
import styles from './Reports.module.css'

export const Reports = () => {
  const { status } = useReportsFacade()

  return (
    <Box className={styles.reportsPage} direction="column">
      <Header
        mb={{ mobile: 4, desktop: 6 }}
        className={`${motion.deal} ${styles.headerRegion}`}
        title="Relatório"
        description="O que a loja vendeu no período — só pedidos concluídos entram na conta."
      />

      <ReportsPeriodControls />

      {status === 'pending' && <ReportsSkeleton />}
      {status === 'ready' && <ReportsContent />}
      <ReportsNotice />
    </Box>
  )
}
