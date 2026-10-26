import type { GuestOrderStatus } from '@custom_types/order/guest-order-status'
import type { OrderStatus } from '@custom_types/order/order-status'

/** O que a jornada precisa saber do pedido — nada além disto. */
type JourneySource = Pick<GuestOrderStatus, 'channel' | 'timeline'>

/**
 * Entrega ou retirada. O `channel` é a fonte boa, mas ele nem sempre vem: o
 * endpoint público de status é mínimo por design e pode não expor o canal.
 * Sem ele, o próprio histórico entrega a resposta — só pedido de balcão passa
 * por PRONTO PARA RETIRADA. Na dúvida, entrega: é o caso comum, e é o único
 * palpite que não promete um balcão pra quem está esperando em casa.
 */
const isPickup = (order: JourneySource): boolean => {
  if (order.channel) return order.channel !== 'DELIVERY'

  return order.timeline.some(
    ({ status }) => status === 'READY_FOR_PICKUP' || status === 'COMPLETED'
  )
}

/**
 * A jornada inteira, não só o que já aconteceu. Quem abre a tela quer saber
 * quanto ainda falta, e uma lista que só cresce nunca responde isso — o
 * pedido parece parado no último passo registrado. O fim muda com o canal:
 * entrega termina na porta, retirada termina no balcão.
 */
const DELIVERY_JOURNEY: OrderStatus[] = [
  'PENDING',
  'ACCEPTED',
  'PREPARING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
]

const PICKUP_JOURNEY: OrderStatus[] = [
  'PENDING',
  'ACCEPTED',
  'PREPARING',
  'READY_FOR_PICKUP',
  'COMPLETED',
]

export const journeyFor = (order: JourneySource): OrderStatus[] =>
  isPickup(order) ? PICKUP_JOURNEY : DELIVERY_JOURNEY

const TERMINAL: OrderStatus[] = ['DELIVERED', 'COMPLETED', 'CANCELLED']

export const isTerminal = (status: OrderStatus): boolean =>
  TERMINAL.includes(status)

/**
 * A linha de apoio do cartão: o rótulo diz em que passo o pedido está, esta
 * frase diz o que acontece a seguir — é ela que autoriza a pessoa a largar o
 * celular.
 */
const STAGE_NOTE: Record<OrderStatus, string> = {
  PENDING: 'A loja já foi avisada. A confirmação costuma vir em minutos.',
  ACCEPTED: 'Confirmado — a cozinha está com ele.',
  PREPARING: 'Está no fogo. Avisamos assim que sair para entrega.',
  OUT_FOR_DELIVERY: 'Na rua, a caminho do seu endereço.',
  READY_FOR_PICKUP: 'Pronto no balcão, esperando por você.',
  DELIVERED: 'Chegou. Bom apetite!',
  COMPLETED: 'Retirado. Bom apetite!',
  CANCELLED: 'Este pedido não vai adiante. Dá para fazer outro quando quiser.',
}

const PICKUP_NOTE: Partial<Record<OrderStatus, string>> = {
  PREPARING: 'Está no fogo. Avisamos assim que estiver pronto para retirar.',
}

export const stageNote = (order: JourneySource, status: OrderStatus): string =>
  (isPickup(order) ? PICKUP_NOTE[status] : undefined) ?? STAGE_NOTE[status]

/**
 * Cada passo tem a cara do que acontece nele — a mesma ideia da demo da
 * landing. O que já passou vira ✓ na hora de desenhar: confirmação vale mais
 * que ilustração depois do fato. O que está acontecendo e o que ainda vem
 * guardam o ícone, e é ele que diz do que se trata antes da leitura.
 */
const STAGE_ICON: Record<OrderStatus, string> = {
  PENDING: '⏱',
  ACCEPTED: '🧾',
  PREPARING: '🍳',
  OUT_FOR_DELIVERY: '🛵',
  READY_FOR_PICKUP: '🛍️',
  DELIVERED: '✅',
  COMPLETED: '✅  ',
  CANCELLED: '✕',
}

export const stageIcon = (status: OrderStatus): string => STAGE_ICON[status]

/** "faltam X min para" o quê — a espera de entrega e a de balcão diferem. */
export const etaLead = (order: JourneySource): string =>
  isPickup(order) ? 'Fica pronto em' : 'Chega em'
