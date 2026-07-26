import { useMemo, useState } from 'react'

import { DatePicker } from '@nino/ds/components/DatePicker'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Tabs } from '@nino/ds/components/Tabs'
import { PageTitle } from '@components/PageTitle'
import { CountUp } from '@components/CountUp'
import type { PeriodChoice } from '@custom_types/ui'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useSalesReport } from '@hooks/order/useSalesReport'
import { useTimingReport } from '@hooks/order/useTimingReport'
import { brl } from '@utils/money'
import { riseDelay } from '@utils/rise-delay'
import {
  customRange,
  dateToInput,
  parseInputDate,
  rangeOf,
  todayInput,
} from '@utils/report-range'

import styles from './Reports.module.css'
import motion from '@styles/motion.module.css'

const PERIODS: { id: PeriodChoice; label: string }[] = [
  { id: 'today', label: 'Hoje' },
  { id: 'week', label: '7 dias' },
  { id: 'month', label: '30 dias' },
  { id: 'custom', label: 'Escolher' },
]

const FIGURES: {
  key: 'revenue' | 'orderCount' | 'averageTicket'
  label: string
  money: boolean
}[] = [
  { key: 'revenue', label: 'Faturamento', money: true },
  { key: 'orderCount', label: 'Pedidos concluídos', money: false },
  { key: 'averageTicket', label: 'Ticket médio', money: true },
]

const TIMING_FIGURES: {
  key: 'averagePreparationMinutes' | 'averageDeliveryMinutes'
  sampleKey: 'preparationSampleSize' | 'deliverySampleSize'
  label: string
}[] = [
  {
    key: 'averagePreparationMinutes',
    sampleKey: 'preparationSampleSize',
    label: 'Tempo médio de preparo',
  },
  {
    key: 'averageDeliveryMinutes',
    sampleKey: 'deliverySampleSize',
    label: 'Tempo médio de entrega',
  },
]

export const Reports = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null

  const [period, setPeriod] = useState<PeriodChoice>('today')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  /**
   * Sem memo, `rangeOf` gera um `to` novo a cada render — a query key muda,
   * dispara outro fetch, o `isPending` muda e o componente renderiza de novo:
   * loop infinito de requisições. Trava em `period`/`customFrom`/`customTo`.
   */
  const range = useMemo(
    () =>
      period === 'custom' ? customRange(customFrom, customTo) : rangeOf(period),
    [period, customFrom, customTo]
  )

  const { report, isPending } = useSalesReport(
    range ? tenantId : null,
    range?.from ?? '',
    range?.to ?? ''
  )
  const { report: timing, isPending: isTimingPending } = useTimingReport(
    range ? tenantId : null,
    range?.from ?? '',
    range?.to ?? ''
  )

  const awaitingDates = period === 'custom' && !range
  const noSales = !isPending && !awaitingDates && report?.orderCount === 0

  return (
    <div className={styles.page}>
      <header className={`${motion.deal} ${styles.header}`}>
        <PageTitle accent="venda">Relatório de venda</PageTitle>
        <p className={styles.subtitle}>
          O que a loja vendeu no período — só pedidos concluídos entram na
          conta.
        </p>
      </header>

      <Tabs
        className={motion.unroll}
        tabs={PERIODS.map(({ id, label }) => ({ value: id, label, content: null }))}
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
        {FIGURES.map(({ key, label, money }, index) => (
          <div
            key={key}
            className={`${motion.settle} ${styles.figure}`}
            style={riseDelay(index * 60)}
          >
            <span className={styles.value}>
              {isPending || !report ? (
                '·'
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
          {TIMING_FIGURES.map(({ key, sampleKey, label }, index) => {
            const noSample = !isTimingPending && timing?.[sampleKey] === 0
            return (
              <div
                key={key}
                className={`${motion.settle} ${styles.figure}`}
                style={riseDelay((FIGURES.length + index) * 60)}
              >
                <span className={styles.value}>
                  {isTimingPending || !timing ? (
                    '·'
                  ) : noSample ? (
                    '—'
                  ) : (
                    <>
                      <CountUp value={Math.round(timing[key])} /> min
                    </>
                  )}
                </span>
                <span className={styles.label}>{label}</span>
              </div>
            )
          })}
        </div>
      )}

      <section className={styles.top} aria-label="Produtos mais vendidos">
        <h2 className={styles.topTitle}>Mais vendidos</h2>

        {awaitingDates && (
          <p className={styles.empty}>
            Escolha as datas de início e fim para ver o relatório.
          </p>
        )}

        {!awaitingDates && isPending && (
          <Skeleton className={styles.topSkeleton} />
        )}

        {noSales && (
          <p className={styles.empty}>Nenhuma venda concluída no período.</p>
        )}

        {!awaitingDates && !isPending && !noSales && (
          <ol className={styles.ranking}>
            {report?.topProducts.map((item, index) => (
              <li
                key={item.productId}
                className={`${motion.deal} ${styles.rank}`}
                style={riseDelay(index * 40)}
              >
                <span className={styles.position}>{index + 1}</span>
                <span className={styles.rankName}>{item.name}</span>
                <span className={styles.rankQty}>{item.quantity} un</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}
