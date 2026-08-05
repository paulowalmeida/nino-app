import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'

import { DatePicker } from '@nino/ds/components/DatePicker'
import { PageHeader } from '@nino/ds/components/PageHeader'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Tabs } from '@nino/ds/components/Tabs'
import { CountUp } from '@nino/ds/components/CountUp'
import { TopSalesTable } from '@compositions/TopSalesTable/TopSalesTable'
import type { ReportRangeParams } from '@custom_types/order/report-range-params'
import type { PeriodChoice } from '@custom_types/ui/period-choice'
import {
  REPORTS_FIGURES,
  REPORTS_PERIODS,
  REPORTS_TIMING_FIGURES,
} from '@constants/order.constants'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useSalesReport } from '@hooks/order/useSalesReport'
import { useTimingReport } from '@hooks/order/useTimingReport'
import { brl } from '@utils/money'
import { riseDelay } from '@utils/rise-delay'
import { dateToInput, parseInputDate, todayInput } from '@utils/date-input'

import styles from './Reports.module.css'
import motion from '@styles/motion.module.css'

export const Reports = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null

  /**
   * O período vive na URL: o link que vem da visão geral já chega no recorte
   * certo, e recarregar ou compartilhar devolve o mesmo relatório.
   */
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

  /* Preset ou dias: quem traduz para instante é a API, no fuso da loja. O
     objeto é memoizado porque vira query key — recriá-lo a cada render
     dispararia fetch em laço. */
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

  const noSales =
    !isPending && !isError && !awaitingDates && report?.orderCount === 0

  return (
    <div className={styles.page}>
      <PageHeader
        className={`${motion.deal} ${styles.header}`}
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
        <div className={`${motion.unroll} ${styles.dates}`}>
          <label className={styles.date}>
            <span className={styles.dateLabel}>De</span>
            <DatePicker
              value={customFrom ? parseInputDate(customFrom) : undefined}
              onValueChange={(date) =>
                setCustomFrom(date ? dateToInput(date) : '')
              }
              endMonth={parseInputDate(customTo || todayInput())}
            />
          </label>
          <label className={styles.date}>
            <span className={styles.dateLabel}>Até</span>
            <DatePicker
              value={customTo ? parseInputDate(customTo) : undefined}
              onValueChange={(date) =>
                setCustomTo(date ? dateToInput(date) : '')
              }
              startMonth={customFrom ? parseInputDate(customFrom) : undefined}
              endMonth={parseInputDate(todayInput())}
            />
          </label>
        </div>
      )}

      <div className={styles.figures}>
        {REPORTS_FIGURES.map(({ key, label, money }, index) => (
          <div
            key={key}
            className={`${motion.settle} ${styles.figure}`}
            style={riseDelay(index * 60)}
          >
            <span className={styles.value}>
              {isPending || !report ? (
                <Skeleton
                  className={money ? styles.ghostMoney : styles.ghostCount}
                />
              ) : money ? (
                brl(report[key])
              ) : (
                <CountUp value={report[key]} />
              )}
            </span>
            <span className={styles.label}>{label}</span>
          </div>
        ))}
      </div>

      {!awaitingDates && (
        <div className={styles.timingFigures}>
          {REPORTS_TIMING_FIGURES.map(
            ({ key, sampleKey, label, empty }, index) => {
              const noSample = !isTimingPending && timing?.[sampleKey] === 0
              return (
                <div
                  key={key}
                  className={`${motion.settle} ${styles.figure}`}
                  style={riseDelay((REPORTS_FIGURES.length + index) * 60)}
                >
                  <span className={noSample ? styles.valueEmpty : styles.value}>
                    {isTimingPending || !timing ? (
                      <Skeleton className={styles.ghostCount} />
                    ) : noSample ? (
                      empty
                    ) : (
                      <>
                        <CountUp value={Math.round(timing[key])} /> min
                      </>
                    )}
                  </span>
                  <span className={styles.label}>{label}</span>
                </div>
              )
            }
          )}
        </div>
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
