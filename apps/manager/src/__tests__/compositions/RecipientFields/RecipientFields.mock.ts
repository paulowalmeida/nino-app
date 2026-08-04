import type { Recipient } from '@pages/new-order/NewOrder.types'

export const emptyRecipient: Recipient = {
  name: '',
  phone: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  zoneId: '',
}

export const zones = [
  { value: 'zone-1', label: 'Centro' },
  { value: 'zone-2', label: 'Aldeota' },
]
