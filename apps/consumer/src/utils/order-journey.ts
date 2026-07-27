import type { OrderChannel } from '@custom_types/order/order-channel'
import type { OrderStatus } from '@custom_types/order/order-status'

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

export const journeyFor = (channel: OrderChannel): OrderStatus[] =>
  channel === 'DELIVERY' ? DELIVERY_JOURNEY : PICKUP_JOURNEY

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

export const stageNote = (
  status: OrderStatus,
  channel: OrderChannel
): string =>
  (channel === 'DELIVERY' ? undefined : PICKUP_NOTE[status]) ??
  STAGE_NOTE[status]

/**
 * Cada passo tem a cara do que acontece nele — a mesma ideia da demo da
 * landing. O que já passou vira ✓ na hora de desenhar: confirmação vale mais
 * que ilustração depois do fato. O que está acontecendo e o que ainda vem
 * guardam o ícone, e é ele que diz do que se trata antes da leitura.
 */
const STAGE_ICON: Record<OrderStatus, string> = {
  PENDING: '🧾',
  ACCEPTED: '👩‍🍳',
  PREPARING: '🍳',
  OUT_FOR_DELIVERY: '🛵',
  READY_FOR_PICKUP: '🛍️',
  DELIVERED: '🍽️',
  COMPLETED: '🍽️',
  CANCELLED: '✕',
}

export const stageIcon = (status: OrderStatus): string => STAGE_ICON[status]

/** "faltam X min para" o quê — a espera de entrega e a de balcão diferem. */
export const etaLead = (channel: OrderChannel): string =>
  channel === 'DELIVERY' ? 'Chega em' : 'Fica pronto em'
