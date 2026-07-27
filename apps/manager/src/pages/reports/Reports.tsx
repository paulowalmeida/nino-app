import { useMemo, useState } from 'react'

import { DatePicker } from '@nino/ds/components/DatePicker'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { PageHeader } from '@nino/ds/components/PageHeader'
import { Skeleton } from '@nino/ds/components/Skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@nino/ds/components/Table'
import { Tabs } from '@nino/ds/components/Tabs'
import { CountUp } from '@components/CountUp'
import type { ReportRangeParams } from '@custom_types/order'
import type { PeriodChoice } from '@custom_types/ui'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useSalesReport } from '@hooks/order/useSalesReport'
import { useTimingReport } from '@hooks/order/useTimingReport'
import { brl } from '@utils/money'
import { riseDelay } from '@utils/rise-delay'
import { dateToInput, parseInputDate, todayInput } from '@utils/date-input'

import styles from './Reports.module.css'
import motion from '@styles/motion.module.css'

const PERIODS: { id: PeriodChoice; label: string }[] = [
  { id: 'today', label: 'Hoje' },
  { id: 'week', label: '7 dias' },
  { id: 'fortnight', label: '15 dias' },
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

/** Pódio: as três primeiras linhas leem antes das outras. */
const podiumClass = (index: number): string => {
  if (index === 0) return `${styles.podium} ${styles.leader}`
  return index < 3 ? styles.podium : ''
}

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
        tabs={PERIODS.map(({ id, label }) => ({
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
          <EmptyState>
            Escolha as datas de início e fim para ver o relatório.
          </EmptyState>
        )}

        {/* O teto da janela é da API — mostrar o que ela recusou evita duas
            regras de limite vivendo em lugares diferentes. */}
        {isError && (
          <EmptyState title="Não deu para montar o relatório">
            Confira o período escolhido — janelas muito longas não são aceitas.
          </EmptyState>
        )}

        {!awaitingDates && isPending && (
          <Skeleton className={styles.topSkeleton} />
        )}

        {noSales && (
          <EmptyState>Nenhuma venda concluída no período.</EmptyState>
        )}

        {!awaitingDates && !isPending && !noSales && (
          <div className={styles.tableWrap}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={styles.colRank}>#</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead className={styles.colNumber}>Qtd.</TableHead>
                  <TableHead className={styles.colNumber}>Preço un.</TableHead>
                  <TableHead className={styles.colNumber}>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report?.topProducts.map((item, index) => (
                  <TableRow
                    key={item.productId}
                    className={`${motion.deal} ${podiumClass(index)}`}
                    style={riseDelay(index * 40)}
                  >
                    <TableCell className={styles.colRank}>
                      <span className={styles.position}>{index + 1}</span>
                    </TableCell>
                    <TableCell className={styles.rankName}>
                      {item.name}
                    </TableCell>
                    <TableCell className={styles.colNumber}>
                      {item.quantity} un
                    </TableCell>
                    <TableCell className={styles.colNumber}>
                      {brl(item.unitPrice)}
                    </TableCell>
                    <TableCell className={styles.colTotal}>
                      {brl(item.revenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  )
}
