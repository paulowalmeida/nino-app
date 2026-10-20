import { Grid } from '@nino/ds/components/Grid'
import { SalesBreakdown } from '@pages/Reports/components/SalesBreakdown/SalesBreakdown'
import { SalesFiguresGrid } from '@pages/Reports/components/SalesFiguresGrid/SalesFiguresGrid'
import { SalesPeriodTrend } from '@pages/Reports/components/SalesPeriodTrend/SalesPeriodTrend'
import { SalesTrendByDimension } from '@pages/Reports/components/SalesTrendByDimension/SalesTrendByDimension'
import { TimingFiguresGrid } from '@pages/Reports/components/TimingFiguresGrid/TimingFiguresGrid'
import { TopSalesTable } from '@pages/Reports/components/TopSalesTable/TopSalesTable'
import { useReportsFacade } from '@pages/Reports/facades/useReportsFacade/useReportsFacade'

export const ReportsContent = () => {
  const { report, timing, trend, series, breakdown, labels } =
    useReportsFacade()

  if (
    !report.report ||
    !timing.report ||
    !trend.series ||
    !series.channel.breakdown ||
    !series.payment.breakdown
  ) {
    return null
  }

  return (
    <>
      <SalesFiguresGrid report={report.report} delay={80} />

      <SalesPeriodTrend series={trend.series} delay={290} />

      <SalesTrendByDimension
        title="Faturamento por canal"
        delay={360}
        breakdown={series.channel.breakdown}
        labelOf={(key) => labels.channel[key as keyof typeof labels.channel]}
      />

      <SalesTrendByDimension
        title="Faturamento por forma de pagamento"
        delay={430}
        breakdown={series.payment.breakdown}
        labelOf={(key) => labels.payment[key as keyof typeof labels.payment]}
      />

      <TimingFiguresGrid timing={timing.report} delay={500} />

      <Grid
        columns={{ mobile: 1, desktop: 2 }}
        gap={4}
        mb={{ mobile: 4, desktop: 8 }}
      >
        <SalesBreakdown
          title="Por canal"
          delay={640}
          items={breakdown.channel}
          emptyMessage="Nenhuma venda concluída no período."
        />
        <SalesBreakdown
          title="Por forma de pagamento"
          delay={710}
          items={breakdown.payment}
          emptyMessage="Nenhuma venda concluída no período."
        />
      </Grid>

      <TopSalesTable products={report.report.topProducts} delay={780} />
    </>
  )
}
