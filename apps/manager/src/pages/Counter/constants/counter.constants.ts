import type { OrderChannel } from '@shared/types/order/order-channel'
import type { PaymentMethod } from '@shared/types/order/payment-method'

export const CASH_NOTES = [2, 5, 10, 20, 50, 100, 200]

export const CASH_SUGGESTION_LIMIT = 3

export const PRODUCT_GRID_SKELETON_TABS = ['first', 'second', 'third']
export const PRODUCT_GRID_SKELETON_CARDS = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
]

/** A linha de apoio de cada destino, igual no cartão de escolha e no papel. */
export const COUNTER_CHANNEL_HINT: Record<OrderChannel, string> = {
  PICKUP: 'Cliente retira no balcão',
  COUNTER: 'Cliente consome no local',
  DELIVERY: 'Cliente recebe no endereço',
  TABLE_TAB: 'Cliente consome no local',
}

/**
 * Como a forma de pagamento entra no meio da frase lida em voz alta: Pix é
 * nome próprio e mantém a maiúscula, os outros dois não.
 */
export const COUNTER_PAYMENT_SPOKEN: Record<PaymentMethod, string> = {
  CASH: 'dinheiro',
  PIX: 'Pix',
  CARD_ON_DELIVERY: 'cartão',
  CARD_ONLINE: 'cartão',
}
