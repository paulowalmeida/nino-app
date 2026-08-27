import { BarList } from '@nino/ds/components/BarList'
import { Box } from '@nino/ds/components/Box'
import { CountUp } from '@nino/ds/components/CountUp'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { useOverviewFacade } from '@pages/Overview/facades/useOverviewFacade/useOverviewFacade'
import { tallyToday } from '@pages/Overview/utils/day-tally'
import { PAYMENT_METHOD_LABEL } from '@shared/constants/order.constants'
import { brl } from '@shared/utils/money/money'

import { DayTallySkeleton } from './DayTallySkeleton/DayTallySkeleton'
import { TallyCard } from './TallyCard/TallyCard'
import { TallyHistory } from './TallyHistory/TallyHistory'

import styles from './DayTally.module.css'

const RECENT = 4

export const DayTally = () => {
  const { orders: ordersQuery, timezone } = useOverviewFacade()
  const { orders, isPending } = ordersQuery

  const zone = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
  const {
    orders: count,
    revenue,
    average,
    byPaymentMethod,
  } = tallyToday(orders, zone)
  const recent = orders.slice(0, RECENT)

  const paymentBars = byPaymentMethod.map(({ method, amount }) => ({
    id: method,
    label: PAYMENT_METHOD_LABEL[method],
    value: amount,
    display: brl(amount),
  }))

  return (
    <Box as="section" aria-label="O dia até agora" className="mb-8">
      <Eyebrow className="mb-3">O dia até agora</Eyebrow>

      <Box className={styles.tally}>
        <TallyCard
          to="../pedidos?etapa=closed"
          ariaLabel="Ver os pedidos fechados"
          label="pedidos fechados"
          isPending={isPending}
          value={<CountUp value={count} />}
          skeletonClassName={styles.skeletonCount}
        />

        <TallyCard
          to="../relatorios?periodo=today"
          ariaLabel="Ver o relatório de faturamento de hoje"
          label="entraram no caixa"
          isPending={isPending}
          value={brl(revenue)}
          skeletonClassName={styles.skeletonMoney}
          delay={70}
        />

        <TallyCard
          to="../relatorios?periodo=today"
          ariaLabel="Ver o ticket médio de hoje no relatório"
          label="por pedido"
          isPending={isPending}
          value={brl(average)}
          skeletonClassName={styles.skeletonAverage}
          delay={140}
        />
      </Box>

      {isPending && <DayTallySkeleton />}

      {!isPending && paymentBars.length > 0 && (
        <Box className={styles.payments}>
          <Eyebrow className="mb-3">Por forma de pagamento</Eyebrow>
          <BarList items={paymentBars} className="text-brand" />
        </Box>
      )}

      {!isPending && recent.length > 0 && <TallyHistory recent={recent} />}
    </Box>
  )
}
