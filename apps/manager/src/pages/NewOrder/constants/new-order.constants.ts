import type { OrderChannel } from '@shared/types/order/order-channel'
import type { Recipient } from '@shared/types/order/recipient'

export const NEW_ORDER_TICKET_CHANNELS: OrderChannel[] = [
  'COUNTER',
  'PICKUP',
  'DELIVERY',
]

export const NEW_ORDER_EMPTY_RECIPIENT: Recipient = {
  name: '',
  phone: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  zoneId: '',
}

export const NEW_ORDER_MENU_GHOST_SECTIONS = ['first', 'second']

export const NEW_ORDER_MENU_GHOST_ITEMS = ['first', 'second', 'third']
