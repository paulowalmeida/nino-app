import { useSearchParams } from 'react-router'

import { Button, Skeleton } from '@nino/ds'

import { PageTitle } from '@components/PageTitle'
import { OrderTicket } from '@compositions/OrderTicket'
import { StageTrack } from '@compositions/StageTrack'
import type { StageOption } from '@compositions/StageTrack/StageTrack.types'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useOrders } from '@hooks/order/useOrders'
import { useOrderStatus } from '@hooks/order/useOrderStatus'
import type { OrderStage, OrderStatusKey } from '@custom_types/order'
import { riseDelay } from '@utils/rise-delay'
import { stageOf } from '@utils/order-flow'

import styles from './Orders.module.css'
import motion from '@styles/motion.module.css'

const STAGES: { id: OrderStage; label: string; empty: string }[] = [
  {
    id: 'incoming',
    label: 'Novos',
    empty: 'Nenhum pedido esperando aceite.',
  },
  {
    id: 'kitchen',
    label: 'Na cozinha',
    empty: 'A cozinha está livre.',
  },
  {
    id: 'street',
    label: 'Na rua',
    empty: 'Nenhuma entrega em andamento.',
  },
  {
    id: 'counter',
    label: 'No balcão',
    empty: 'Nada esperando retirada.',
  },
  {
    id: 'closed',
    label: 'Fechados',
    empty: 'Os pedidos concluídos aparecem aqui.',
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

  const options: StageOption[] = STAGES.map(({ id, label }) => ({
    id,
    label,
    count: orders.filter((order) => stageOf(order.status) === id).length,
  }))

  const shown = orders.filter((order) => stageOf(order.status) === stage)
  const empty = STAGES.find(({ id }) => id === stage)?.empty ?? ''

  const handleAdvance = (orderId: string, target: OrderStatusKey) =>
    advance({ orderId, status: target })

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headText}>
          <PageTitle accent="Pedidos">Pedidos</PageTitle>
          <p className={styles.subtitle}>
            Cada comanda mostra o próximo passo. Um toque move o pedido
            adiante.
          </p>
        </div>
      </header>

      <div className={`${motion.unroll} ${styles.track}`}>
        <StageTrack stages={options} value={stage} onChange={setStage} />
      </div>

      {isPending && (
        <div className={styles.loading}>
          <Skeleton className={styles.skeletonTicket} />
          <Skeleton className={styles.skeletonTicket} />
          <Skeleton className={styles.skeletonTicket} />
        </div>
      )}

      {isError && (
        <p className={styles.notice}>
          Não foi possível carregar os pedidos. Recarregue a página para tentar
          de novo.
        </p>
      )}

      {!isPending && !isError && shown.length === 0 && (
        <p className={`${motion.unroll} ${styles.notice}`}>{empty}</p>
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
  )
}
