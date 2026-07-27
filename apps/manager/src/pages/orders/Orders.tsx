import { useSearchParams } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { PageHeader } from '@nino/ds/components/PageHeader'
import { Skeleton } from '@nino/ds/components/Skeleton'
import type { NavIconName } from '@components/NavIcon/NavIcon.types'
import { OrderTicket } from '@compositions/OrderTicket'
import { StageTrack } from '@compositions/StageTrack'
import type { StageOption } from '@compositions/StageTrack/StageTrack.types'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useOrders } from '@hooks/order/useOrders'
import { useOrderStatus } from '@hooks/order/useOrderStatus'
import type { OrderStage } from '@custom_types/order'
import type { OrderStatusKey } from '@custom_types/order/order-status-key'
import { riseDelay } from '@utils/rise-delay'
import { stageOf } from '@utils/order-flow'

import styles from './Orders.module.css'
import motion from '@styles/motion.module.css'

type Stage = {
  id: OrderStage
  label: string
  empty: string
  icon: NavIconName
}

const STAGES: Stage[] = [
  {
    id: 'incoming',
    label: 'Novos',
    empty: 'Nenhum pedido esperando aceite.',
    icon: 'receipt',
  },
  {
    id: 'kitchen',
    label: 'Na cozinha',
    empty: 'A cozinha está livre.',
    icon: 'chef',
  },
  {
    id: 'street',
    label: 'Na rua',
    empty: 'Nenhuma entrega em andamento.',
    icon: 'pin',
  },
  {
    id: 'counter',
    label: 'No balcão',
    empty: 'Nada esperando retirada.',
    icon: 'register',
  },
  {
    id: 'closed',
    label: 'Fechados',
    empty: 'Os pedidos concluídos aparecem aqui.',
    icon: 'check',
  },
]

export const Orders = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null
  /**
   * A etapa mora na URL: assim o quadro da visão geral aponta direto para
   * ela, o link é compartilhável e voltar do navegador funciona.
   */
  const [params, setParams] = useSearchParams()
  const fromUrl = params.get('etapa') as OrderStage | null
  const stage: OrderStage =
    fromUrl && STAGES.some(({ id }) => id === fromUrl) ? fromUrl : 'incoming'

  const setStage = (next: OrderStage) =>
    setParams(next === 'incoming' ? {} : { etapa: next }, { replace: true })

  const { orders, isPending, isError, hasNextPage, fetchNextPage } =
    useOrders(tenantId)
  const {
    mutate: advance,
    isPending: isAdvancing,
    variables,
  } = useOrderStatus(tenantId)

  const options: StageOption[] = STAGES.map(({ id, label, icon }) => ({
    id,
    label,
    icon,
    count: orders.filter((order) => stageOf(order.status) === id).length,
  }))

  const shown = orders.filter((order) => stageOf(order.status) === stage)
  const empty = STAGES.find(({ id }) => id === stage)?.empty ?? ''

  const handleAdvance = (orderId: string, target: OrderStatusKey) =>
    advance({ orderId, status: target })

  return (
    <div className={styles.page}>
      <PageHeader
        className={styles.header}
        title="Pedidos"
        accent="Pedidos"
        description="Cada comanda mostra o próximo passo. Um toque move o pedido adiante."
      />

      <div className={`${motion.unroll} ${styles.track}`}>
        <StageTrack stages={options} value={stage} onChange={setStage} />
      </div>

      {/* só a bobina rola: cabeçalho e trilha ficam parados no desktop */}
      <div className={styles.queue}>
        {isPending && (
          <div className={styles.loading}>
            <Skeleton className={styles.skeletonTicket} />
            <Skeleton className={styles.skeletonTicket} />
            <Skeleton className={styles.skeletonTicket} />
          </div>
        )}

        {isError && (
          <Alert variant="error">
            Não foi possível carregar os pedidos. Recarregue a página para
            tentar de novo.
          </Alert>
        )}

        {!isPending && !isError && shown.length === 0 && (
          <EmptyState size="md" className={motion.unroll}>
            {empty}
          </EmptyState>
        )}

        {shown.length > 0 && (
          <ul className={styles.board}>
            {shown.map((order, index) => (
              <li
                key={order.id}
                className={motion.settle}
                style={riseDelay(index * 55 + 80)}
              >
                <OrderTicket
                  order={order}
                  onAdvance={handleAdvance}
                  isBusy={isAdvancing && variables?.orderId === order.id}
                />
              </li>
            ))}
          </ul>
        )}

        {stage === 'closed' && hasNextPage && (
          <div className={styles.more}>
            <Button
              variant="outline"
              size="sm"
              className={motion.press}
              onClick={() => void fetchNextPage()}
            >
              Carregar pedidos mais antigos
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
