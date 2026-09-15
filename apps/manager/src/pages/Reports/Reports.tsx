import { Box } from '@nino/ds/components/Box'
import { Grid } from '@nino/ds/components/Grid'
import { Header } from '@nino/ds/components/Header'

import { ReportsPeriodControls } from './components/ReportsPeriodControls/ReportsPeriodControls'
import { SalesBreakdown } from './components/SalesBreakdown/SalesBreakdown'
import { SalesFiguresGrid } from './components/SalesFiguresGrid/SalesFiguresGrid'
import { SalesPeriodTrend } from './components/SalesPeriodTrend/SalesPeriodTrend'
import { SalesTrendByDimension } from './components/SalesTrendByDimension/SalesTrendByDimension'
import { TimingFiguresGrid } from './components/TimingFiguresGrid/TimingFiguresGrid'
import { TopSalesTable } from './components/TopSalesTable/TopSalesTable'
import { useReportsFacade } from './facades/useReportsFacade/useReportsFacade'

import motion from '@styles/motion.module.css'
import styles from './Reports.module.css'

export const Reports = () => {
  const reports = useReportsFacade()
  const { report, timing, series, breakdown, custom, period, unitId } = reports
  const noSales = !report.isPending && !report.isError && !custom.awaitingDates && report.report?.orderCount === 0
  const showReport = !custom.awaitingDates

  return (
    <Box className={styles.page} direction="column">
      <Header mb={{ mobile: 4, desktop: 6 }} className={motion.deal} title="Relatório de venda" accent="venda" description="O que a loja vendeu no período — só pedidos concluídos entram na conta." />
      <ReportsPeriodControls period={period} onPeriodChange={reports.setPeriod} custom={custom} />
      <SalesFiguresGrid report={report.report} isPending={report.isPending} />
      {showReport && <SalesPeriodTrend unitId={unitId} range={reports.range} />}
      {showReport && <SalesTrendByDimension title="Faturamento por canal" breakdown={series.channel.breakdown} isPending={series.channel.isPending} labelOf={(key) => reports.labels.channel[key as keyof typeof reports.labels.channel]} emptyMessage="Nenhuma venda concluída no período." />}
      {showReport && <SalesTrendByDimension title="Faturamento por forma de pagamento" breakdown={series.payment.breakdown} isPending={series.payment.isPending} labelOf={(key) => reports.labels.payment[key as keyof typeof reports.labels.payment]} emptyMessage="Nenhuma venda concluída no período." />}
      {showReport && <TimingFiguresGrid timing={timing.report} isPending={timing.isPending} />}
      {showReport && <Grid columns={{ mobile: 1, desktop: 2 }} gap={4} mb={{ mobile: 4, desktop: 8 }}><SalesBreakdown title="Por canal" items={breakdown.channel} isPending={report.isPending} emptyMessage="Nenhuma venda concluída no período." /><SalesBreakdown title="Por forma de pagamento" items={breakdown.payment} isPending={report.isPending} emptyMessage="Nenhuma venda concluída no período." /></Grid>}
      <TopSalesTable awaitingDates={custom.awaitingDates} isError={report.isError} isPending={report.isPending} noSales={noSales} products={report.report?.topProducts ?? []} />
    </Box>
  )
}
