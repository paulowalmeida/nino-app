import { Flexbox } from '@nino/ds/components/Flexbox'

import { TallyCard } from '@molecules/TallyCard/TallyCard'
import { PAYMENT_METHOD_LABEL } from '@constants/order.constants'
import { useOrders } from '@hooks/order/useOrders'
import { BarList } from '@nino/ds/components/BarList'
import { CountUp } from '@nino/ds/components/CountUp'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { tallyToday } from '@utils/day-tally'
import { brl } from '@utils/money'

import { TallyHistory } from '@molecules/TallyHistory/TallyHistory'
import { DayTallySkeleton } from '@skeletons/organisms/DayTallySkeleton/DayTallySkeleton'
import styles from './DayTally.module.css'

const RECENT = 4

type DayTallyProps = {
  tenantId: string | null
  timezone: string | null
}

export const DayTally = ({ tenantId, timezone }: DayTallyProps) => {
  const { orders, isPending } = useOrders(tenantId)

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
    <section aria-label="O dia até agora" className="mb-8">
      <Eyebrow className="mb-3">O dia até agora</Eyebrow>

      <Flexbox className={styles.tally}>
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
      </Flexbox>

      {isPending && <DayTallySkeleton />}

      {!isPending && paymentBars.length > 0 && (
        <div className={styles.payments}>
          <Eyebrow className="mb-3">Por forma de pagamento</Eyebrow>
          <BarList items={paymentBars} className="text-brand" />
        </div>
      )}

      {!isPending && recent.length > 0 && <TallyHistory recent={recent} />}
    </section>
  )
}
