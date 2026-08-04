import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Input } from '@nino/ds/components/Input'
import { PageHeader } from '@nino/ds/components/PageHeader'
import type { IconName } from '@nino/ds/components/Icon'
import { OrderTicket } from '@compositions/OrderTicket/OrderTicket'
import { OrderTicketSkeleton } from '@compositions/OrderTicket/OrderTicketSkeleton'
import {
  StageTrack,
  type StageOption,
} from '@compositions/StageTrack/StageTrack'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useOrders } from '@hooks/order/useOrders'
import { useOrderStatus } from '@hooks/order/useOrderStatus'
import { useDebouncedValue } from '@hooks/ui/useDebouncedValue'
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
  icon: IconName
}

/** Quatro comandas: uma linha cheia no desktop, duas telas no celular. */
const LOADING_TICKETS = ['first', 'second', 'third', 'fourth']

const STAGES: Stage[] = [
  {
    id: 'incoming',
    label: 'Novos',
    empty: 'Nenhum pedido esperando aceite.',
    icon: 'receipt',
  },
  {
    id: 'confirmed',
    label: 'Confirmados',
    empty: 'Nenhum pedido confirmado esperando produção.',
    icon: 'clock',
  },
  {
    id: 'kitchen',
    label: 'Na cozinha',
    empty: 'A cozinha está livre.',
    icon: 'chef-hat',
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
    icon: 'cash-register',
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

  /*
   * A busca também mora na URL, pelo mesmo motivo da etapa: o balcão manda o
   * link pra alguém em vez de ditar o código do pedido no telefone.
   */
  const urlSearch = params.get('busca') ?? ''
  const [term, setTerm] = useState(urlSearch)
  const search = useDebouncedValue(term.trim())
  const isSearching = search.length > 0

  useEffect(() => {
    if (search === urlSearch) return

    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (search) next.set('busca', search)
        else next.delete('busca')
        return next
      },
      { replace: true }
    )
  }, [search, urlSearch, setParams])

  const { orders, isPending, isError, hasNextPage, fetchNextPage } = useOrders(
    tenantId,
    search
  )
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

  /*
   * Procurando, a etapa sai do caminho: quem digita um código quer o pedido,
   * não quer descobrir em qual balde ele caiu. O servidor já devolveu só o
   * que casa, então a lista é o resultado inteiro.
   */
  const shown = isSearching
    ? orders
    : orders.filter((order) => stageOf(order.status) === stage)

  const empty = isSearching
    ? `Nenhum pedido encontrado para "${search}".`
    : (STAGES.find(({ id }) => id === stage)?.empty ?? '')

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

      <div className={styles.toolbar}>
        <Input
          type="search"
          value={term}
          placeholder="Buscar por código, nome ou telefone"
          aria-label="Buscar por código, nome ou telefone"
          className={styles.search}
          onChange={(event) => setTerm(event.target.value)}
        />
      </div>

      {isSearching ? (
        <p className={`${motion.unroll} ${styles.results}`} aria-live="polite">
          {shown.length} {shown.length === 1 ? 'pedido' : 'pedidos'} para
          <strong> “{search}”</strong>
          <Button
            variant="ghost"
            size="sm"
            className={motion.press}
            onClick={() => setTerm('')}
          >
            Limpar busca
          </Button>
        </p>
      ) : (
        <div className={`${motion.unroll} ${styles.track}`}>
          <StageTrack stages={options} value={stage} onChange={setStage} />
        </div>
      )}

      {/* só a bobina rola: cabeçalho e trilha ficam parados no desktop */}
      <div className={styles.queue}>
        {isPending && (
          <ul className={styles.board}>
            {LOADING_TICKETS.map((ticket) => (
              <li key={ticket}>
                <OrderTicketSkeleton />
              </li>
            ))}
          </ul>
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

        {(isSearching || stage === 'closed') && hasNextPage && (
          <div className={styles.more}>
            <Button
              variant="outline"
              size="sm"
              className={motion.press}
              onClick={() => void fetchNextPage()}
            >
              {isSearching
                ? 'Carregar mais resultados'
                : 'Carregar pedidos mais antigos'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
