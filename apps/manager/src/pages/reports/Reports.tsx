import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'

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
import { CountUp } from '@nino/ds/components/CountUp'
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

/** Cinco linhas: o tamanho usual do ranking que a API devolve. */
const GHOST_ROWS = ['one', 'two', 'three', 'four', 'five']

/** Um cabeçalho só para os dois estados — carregando e carregado. */
const tableHead = (
  <TableHeader>
    <TableRow>
      <TableHead className={styles.colRank}>#</TableHead>
      <TableHead>Produto</TableHead>
      <TableHead className={styles.colNumber}>Qtd.</TableHead>
      <TableHead className={styles.colNumber}>Preço un.</TableHead>
      <TableHead className={styles.colNumber}>Total</TableHead>
    </TableRow>
  </TableHeader>
)

/** Pódio: as três primeiras linhas leem antes das outras. */
const podiumClass = (index: number): string => {
  if (index === 0) return `${styles.podium} ${styles.leader}`
  return index < 3 ? styles.podium : ''
}

const TIMING_FIGURES: {
  key: 'averagePreparationMinutes' | 'averageDeliveryMinutes'
  sampleKey: 'preparationSampleSize' | 'deliverySampleSize'
  label: string
  empty: string
}[] = [
  {
    key: 'averagePreparationMinutes',
    sampleKey: 'preparationSampleSize',
    label: 'Tempo médio de preparo',
    empty: 'Sem pedidos no período',
  },
  {
    key: 'averageDeliveryMinutes',
    sampleKey: 'deliverySampleSize',
    label: 'Tempo médio de entrega',
    empty: 'Sem entregas no período',
  },
]

export const Reports = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null

  /**
   * O período vive na URL: o link que vem da visão geral já chega no recorte
   * certo, e recarregar ou compartilhar devolve o mesmo relatório.
   */
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get('periodo')
  const period: PeriodChoice = PERIODS.some(({ id }) => id === requested)
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
          {TIMING_FIGURES.map(({ key, sampleKey, label, empty }, index) => {
            const noSample = !isTimingPending && timing?.[sampleKey] === 0
            return (
              <div
                key={key}
                className={`${motion.settle} ${styles.figure}`}
                style={riseDelay((FIGURES.length + index) * 60)}
              >
                <span
                  className={noSample ? styles.valueEmpty : styles.value}
                >
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

        {/* a mesma tabela, com as células por preencher: cabeçalho e larguras
            de coluna já no lugar, para o ranking não se remontar ao chegar */}
        {!awaitingDates && isPending && (
          <div className={styles.tableWrap}>
            <Table>
              {tableHead}
              <TableBody>
                {GHOST_ROWS.map((row) => (
                  <TableRow key={row}>
                    <TableCell className={styles.colRank}>
                      <Skeleton className={styles.ghostPosition} />
                    </TableCell>
                    <TableCell className={styles.rankName}>
                      <Skeleton className={styles.ghostName} />
                    </TableCell>
                    <TableCell className={styles.colNumber}>
                      <Skeleton className={styles.ghostCell} />
                    </TableCell>
                    <TableCell className={styles.colNumber}>
                      <Skeleton className={styles.ghostCell} />
                    </TableCell>
                    <TableCell className={styles.colTotal}>
                      <Skeleton className={styles.ghostCell} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {noSales && (
          <EmptyState>Nenhuma venda concluída no período.</EmptyState>
        )}

        {!awaitingDates && !isPending && !noSales && (
          <div className={styles.tableWrap}>
            <Table>
              {tableHead}
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
