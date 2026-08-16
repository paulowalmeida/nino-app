import { Flexbox } from '@nino/ds/components/Flexbox'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Input } from '@nino/ds/components/Input'
import { Header } from '@nino/ds/components/Header'
import type { IconName } from '@nino/ds/components/Icon'
import { OrderTicket } from '@organisms/OrderTicket/OrderTicket'
import {
  OrderTicketSkeleton,
} from '@skeletons/organisms/OrderTicketSkeleton/OrderTicketSkeleton'
import { StageTrack } from '@organisms/StageTrack/StageTrack'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useOrders } from '@hooks/order/useOrders'
import { useOrderStatus } from '@hooks/order/useOrderStatus'
import { useQueueSummary } from '@hooks/order/useQueueSummary'
import { useDebouncedValue } from '@hooks/ui/useDebouncedValue'
import { useLoadMore } from '@hooks/ui/useLoadMore'
import type { OrderStage } from '@custom_types/order/order-stage'
import type { OrderStatusKey } from '@custom_types/order/order-status-key'
import type { StageOption } from '@custom_types/order/stage-option'
import {
  ORDERS_LOADING_TICKETS,
  ORDERS_STAGES,
} from '@constants/order.constants'
import { riseDelay } from '@utils/rise-delay'
import { statusesForStage } from '@utils/order-flow'

import styles from './Orders.module.css'
import motion from '@styles/motion.module.css'

export type Stage = {
  id: OrderStage
  label: string
  empty: string
  icon: IconName
}

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
    fromUrl && ORDERS_STAGES.some(({ id }) => id === fromUrl)
      ? fromUrl
      : 'incoming'

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

  /*
   * A etapa filtra no servidor, não na página já carregada: um pedido
   * antigo ainda aberto (fora das primeiras páginas por `createdAt`) não
   * pode sumir da aba dele só porque não coube na janela recente.
   * Procurando, a etapa sai do caminho — o servidor já devolveu só o que
   * casa com o termo, então a lista é o resultado inteiro.
   */
  const {
    orders,
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useOrders(
    tenantId,
    search,
    isSearching ? undefined : statusesForStage(stage)
  )

  /*
   * A entrada em cascata é para o que já mostra na tela ao abrir — quem
   * carrega mais rolando até o fim já está olhando pra lá, e um atraso
   * de propósito só segurava o card pronto atrás de um `opacity: 0`
   * sem motivo. `null` enquanto a primeira leva ainda carrega; trava no
   * tamanho dela assim que chega, e destrava nulo de novo se a etapa ou
   * a busca mudam e uma lista nova começa a carregar.
   */
  const [firstBatchSize, setFirstBatchSize] = useState<number | null>(null)
  if (isPending && firstBatchSize !== null) setFirstBatchSize(null)
  else if (!isPending && firstBatchSize === null) {
    setFirstBatchSize(orders.length)
  }

  /* Só "Fechados" e a busca paginam — as outras etapas cabem inteiras numa
     página, então não têm sentinela pra carregar. */
  const paginates = isSearching || stage === 'closed'
  const sentinelRef = useLoadMore(
    paginates && !!hasNextPage,
    () => void fetchNextPage()
  )
  const {
    mutate: advance,
    isPending: isAdvancing,
    variables,
  } = useOrderStatus(tenantId)
  const { data: summary } = useQueueSummary(tenantId)

  /*
   * As contagens da trilha vêm do mesmo agregado do servidor que a Visão
   * Geral usa, não da lista paginada: a lista só carrega a etapa aberta
   * agora, e contar por cima dela subcontaria as outras abas.
   */
  const options: StageOption[] = ORDERS_STAGES.map(({ id, label, icon }) => ({
    id,
    label,
    icon,
    count: statusesForStage(id).reduce(
      (total, status) => total + (summary?.[status] ?? 0),
      0
    ),
  }))

  const shown = orders

  const empty = isSearching
    ? `Nenhum pedido encontrado para "${search}".`
    : (ORDERS_STAGES.find(({ id }) => id === stage)?.empty ?? '')

  const handleAdvance = (orderId: string, target: OrderStatusKey) =>
    advance({ orderId, status: target })

  return (
    <div className={styles.page}>
      <Header
        mb={{ mobile: 3, desktop: 6 }}
        className={styles.header}
        title="Pedidos"
        accent="Pedidos"
        description="Cada comanda mostra o próximo passo. Um toque move o pedido adiante."
      />

      <Flexbox shrink={false} mb={3}>
        <Input
          type="search"
          value={term}
          placeholder="Buscar por código, nome ou telefone"
          aria-label="Buscar por código, nome ou telefone"
          className={styles.search}
          onChange={(event) => setTerm(event.target.value)}
        />
      </Flexbox>

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
            {ORDERS_LOADING_TICKETS.map((ticket) => (
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
            {/*
             * Cascata só na primeira leva (`firstBatchSize`): quem já vê o
             * card na tela ao abrir ganha a entrada em sequência, mas quem
             * carregou mais rolando até o fim já está olhando pra lá — um
             * atraso de propósito aí só segurava o card pronto atrás de um
             * `opacity: 0` (o `fill-mode: both` do `.settle` mantém esse
             * estado durante o atraso), ocupando o lugar na grade sem
             * mostrar nada: o "espaço em branco parado" era exatamente
             * isso.
             */}
            {shown.map((order, index) => (
              <li
                key={order.id}
                className={motion.settle}
                style={riseDelay(
                  index < (firstBatchSize ?? 0)
                    ? Math.min(index, 11) * 55 + 80
                    : 0
                )}
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

        {/*
         * Sentinela, não botão: some do fluxo sem chamar atenção, e só o
         * texto de "carregando" ocupa esse espaço — os cards novos entram
         * no `<ul>` de cima, então o espaço só cresce quando eles já estão
         * prontos para renderizar, não antes.
         */}
        {paginates && hasNextPage && (
          <div ref={sentinelRef} className={styles.sentinel}>
            {isFetchingNextPage && (
              <span className={styles.loadingMore}>Carregando mais…</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
