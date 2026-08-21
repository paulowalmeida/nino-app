import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'

import { DatePicker } from '@nino/ds/components/DatePicker'
import { Box } from '@nino/ds/components/Box'
import { Grid } from '@nino/ds/components/Grid'
import { Header } from '@nino/ds/components/Header'
import { Tabs } from '@nino/ds/components/Tabs'
import { SalesBreakdown } from '@organisms/SalesBreakdown/SalesBreakdown'
import {
  SalesFiguresGrid,
} from '@organisms/SalesFiguresGrid/SalesFiguresGrid'
import {
  SalesPeriodTrend,
} from '@organisms/SalesPeriodTrend/SalesPeriodTrend'
import {
  SalesTrendByDimension,
} from '@organisms/SalesTrendByDimension/SalesTrendByDimension'
import {
  TimingFiguresGrid,
} from '@organisms/TimingFiguresGrid/TimingFiguresGrid'
import { TopSalesTable } from '@organisms/TopSalesTable/TopSalesTable'
import type { ReportRangeParams } from '@custom_types/order/report-range-params'
import type { PeriodChoice } from '@custom_types/ui/period-choice'
import {
  CHANNEL_LABEL,
  PAYMENT_METHOD_LABEL,
  REPORTS_PERIODS,
} from '@constants/order.constants'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useSalesReport } from '@hooks/order/useSalesReport'
import {
  useSalesSeriesByChannel,
} from '@hooks/order/useSalesSeriesByChannel'
import {
  useSalesSeriesByPaymentMethod,
} from '@hooks/order/useSalesSeriesByPaymentMethod'
import { useTimingReport } from '@hooks/order/useTimingReport'
import { dateToInput, parseInputDate, todayInput } from '@utils/date-input'
import {
  channelBreakdownItems,
  paymentMethodBreakdownItems,
} from '@utils/sales-breakdown'

import styles from './Reports.module.css'
import motion from '@styles/motion.module.css'

export const Reports = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null

  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get('periodo')
  const period: PeriodChoice = REPORTS_PERIODS.some(
    ({ id }) => id === requested
  )
    ? (requested as PeriodChoice)
    : 'today'

  const setPeriod = (next: PeriodChoice) =>
    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current)
        params.set('periodo', next)
        return params
      },
      { replace: true }
    )

  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  const awaitingDates = period === 'custom' && (!customFrom || !customTo)

  const range = useMemo<ReportRangeParams | null>(() => {
    if (period !== 'custom') return { period }
    if (!customFrom || !customTo || customFrom > customTo) return null

    return { from: customFrom, to: customTo }
  }, [period, customFrom, customTo])

  const { report, isPending, isError } = useSalesReport(
    range ? tenantId : null,
    range ?? { period: 'today' }
  )
  const { report: timing, isPending: isTimingPending } = useTimingReport(
    range ? tenantId : null,
    range ?? { period: 'today' }
  )
  const {
    breakdown: seriesByChannel,
    isPending: isChannelSeriesPending,
  } = useSalesSeriesByChannel(range ? tenantId : null, range ?? {
    period: 'today',
  })
  const {
    breakdown: seriesByPaymentMethod,
    isPending: isPaymentSeriesPending,
  } = useSalesSeriesByPaymentMethod(range ? tenantId : null, range ?? {
    period: 'today',
  })

  const noSales =
    !isPending && !isError && !awaitingDates && report?.orderCount === 0

  const channelItems = channelBreakdownItems(
    report?.byChannel ?? [],
    (channel) => CHANNEL_LABEL[channel]
  )

  const paymentItems = paymentMethodBreakdownItems(
    report?.byPaymentMethod ?? [],
    (method) => PAYMENT_METHOD_LABEL[method]
  )

  return (
    <div className={styles.page}>
      <Header
        mb={{ mobile: 4, desktop: 6 }}
        className={motion.deal}
        title="Relatório de venda"
        accent="venda"
        description="O que a loja vendeu no período — só pedidos concluídos entram na conta."
      />

      <Tabs
        className={motion.unroll}
        tabs={REPORTS_PERIODS.map(({ id, label }) => ({
          value: id,
          label,
          content: null,
        }))}
        value={period}
        onValueChange={(value) => setPeriod(value as PeriodChoice)}
      />

      {period === 'custom' && (
        <Box
          direction="row"
          gap={3}
          align="end"
          wrap
          mb={{ mobile: 5, desktop: 6 }}
          className={motion.unroll}
        >
          <Box as="label" direction="column" gap={1}>
            <span className={styles.dateLabel}>De</span>
            <DatePicker
              value={customFrom ? parseInputDate(customFrom) : undefined}
              onValueChange={(date) =>
                setCustomFrom(date ? dateToInput(date) : '')
              }
              endMonth={parseInputDate(customTo || todayInput())}
            />
          </Box>
          <Box as="label" direction="column" gap={1}>
            <span className={styles.dateLabel}>Até</span>
            <DatePicker
              value={customTo ? parseInputDate(customTo) : undefined}
              onValueChange={(date) =>
                setCustomTo(date ? dateToInput(date) : '')
              }
              startMonth={customFrom ? parseInputDate(customFrom) : undefined}
              endMonth={parseInputDate(todayInput())}
            />
          </Box>
        </Box>
      )}

      <SalesFiguresGrid report={report} isPending={isPending} />

      {!awaitingDates && (
        <SalesPeriodTrend
          tenantId={range ? tenantId : null}
          range={range ?? { period: 'today' }}
        />
      )}

      {!awaitingDates && (
        <SalesTrendByDimension
          title="Faturamento por canal"
          breakdown={seriesByChannel}
          isPending={isChannelSeriesPending}
          labelOf={(key) => CHANNEL_LABEL[key as keyof typeof CHANNEL_LABEL]}
          emptyMessage="Nenhuma venda concluída no período."
        />
      )}

      {!awaitingDates && (
        <SalesTrendByDimension
          title="Faturamento por forma de pagamento"
          breakdown={seriesByPaymentMethod}
          isPending={isPaymentSeriesPending}
          labelOf={(key) =>
            PAYMENT_METHOD_LABEL[key as keyof typeof PAYMENT_METHOD_LABEL]
          }
          emptyMessage="Nenhuma venda concluída no período."
        />
      )}

      {!awaitingDates && (
        <TimingFiguresGrid timing={timing} isPending={isTimingPending} />
      )}

      {!awaitingDates && (
        <Grid
          columns={{ mobile: 1, desktop: 2 }}
          gap={4}
          mb={{ mobile: 4, desktop: 8 }}
        >
          <SalesBreakdown
            title="Por canal"
            items={channelItems}
            isPending={isPending}
            emptyMessage="Nenhuma venda concluída no período."
          />
          <SalesBreakdown
            title="Por forma de pagamento"
            items={paymentItems}
            isPending={isPending}
            emptyMessage="Nenhuma venda concluída no período."
          />
        </Grid>
      )}

      <TopSalesTable
        awaitingDates={awaitingDates}
        isError={isError}
        isPending={isPending}
        noSales={noSales}
        products={report?.topProducts ?? []}
      />
    </div>
  )
}
