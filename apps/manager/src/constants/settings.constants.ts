import type { PaymentMethod } from '@custom_types/order/payment-method'
import type { ServiceRulesDraft } from '@compositions/ServiceRules/ServiceRules'

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
  'PIX_ONLINE',
  'CARD_ONLINE',
]

export const EMPTY_SERVICE_RULES_DRAFT: ServiceRulesDraft = {
  isDeliveryEnabled: true,
  isPickupEnabled: false,
  isCounterEnabled: false,
  allowGuestOrder: true,
  requireCpf: false,
  minOrderAmount: '0',
  estimatedMinutes: '30',
  acceptedPaymentMethods: [],
}
