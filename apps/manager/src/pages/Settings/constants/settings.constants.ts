import type { PaymentMethod } from '@shared/types/order/payment-method'
import type { ServiceRulesDraft } from '@shared/types/settings/service-rules-draft'

export const WEEK_SCHEDULE_DAYS = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
]

export const SERVICE_RULES_CHANNELS: {
  key: 'isDeliveryEnabled' | 'isPickupEnabled' | 'isCounterEnabled'
  label: string
  hint: string
}[] = [
  {
    key: 'isDeliveryEnabled',
    label: 'Entrega',
    hint: 'A loja leva o pedido até o cliente.',
  },
  {
    key: 'isPickupEnabled',
    label: 'Retirada',
    hint: 'O cliente pede pelo app e busca na loja.',
  },
  {
    key: 'isCounterEnabled',
    label: 'Balcão',
    hint: 'Alguém da equipe registra o pedido no painel.',
  },
]

export const SERVICE_RULES_METHODS: PaymentMethod[] = [
  'CASH',
  'CARD_ON_DELIVERY',
  'PIX',
  'CARD_ONLINE',
]

export const EMPTY_SERVICE_RULES_DRAFT: ServiceRulesDraft = {
  isDeliveryEnabled: true,
  isPickupEnabled: false,
  isCounterEnabled: false,
  allowGuestOrder: true,
  requireCpf: false,
  minOrderAmount: '0',
  preparationMinutes: '30',
  deliveryMinutes: '0',
  acceptedPaymentMethods: [],
}
