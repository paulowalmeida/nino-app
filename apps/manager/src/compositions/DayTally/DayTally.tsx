import { Flexbox } from '@nino/ds/components/Flexbox'

import { TallyCard } from '@components/TallyCard/TallyCard'
import { useOrders } from '@hooks/order/useOrders'
import { CountUp } from '@nino/ds/components/CountUp'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { tallyToday } from '@utils/day-tally'
import { brl } from '@utils/money'

import { TallyHistory } from '@components/TallyHistory/TallyHistory'
import { DayTallySkeleton } from '@skeletons/compositions/DayTallySkeleton/DayTallySkeleton'
import styles from './DayTally.module.css'

const RECENT = 4

type DayTallyProps = {
  tenantId: string | null
  timezone: string | null
}

export const DayTally = ({ tenantId, timezone }: DayTallyProps) => {
  const { orders, isPending } = useOrders(tenantId)

  const zone = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
  const { orders: count, revenue, average } = tallyToday(orders, zone)
  const recent = orders.slice(0, RECENT)

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

      {!isPending && recent.length > 0 && <TallyHistory recent={recent} />}
    </section>
  )
}
