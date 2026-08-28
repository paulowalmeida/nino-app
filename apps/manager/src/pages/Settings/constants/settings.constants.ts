import type { CompanyDraft } from '@shared/types/company/company-draft'
import type { PaymentMethod } from '@shared/types/order/payment-method'
import type { ServiceRulesDraft } from '@shared/types/settings/service-rules-draft'
import type { UnitDraft } from '@shared/types/store/unit-draft'

export const EMPTY_COMPANY_DRAFT: CompanyDraft = {
  name: '',
  legalName: '',
  stateRegistration: '',
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
}

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
  estimatedMinutes: '30',
  acceptedPaymentMethods: [],
}

export const UNIT_TIMEZONES = [
  { value: 'America/Sao_Paulo', label: 'Brasília (GMT-3)' },
  { value: 'America/Belem', label: 'Belém (GMT-3)' },
  { value: 'America/Fortaleza', label: 'Fortaleza (GMT-3)' },
  { value: 'America/Manaus', label: 'Manaus (GMT-4)' },
  { value: 'America/Cuiaba', label: 'Cuiabá (GMT-4)' },
  { value: 'America/Porto_Velho', label: 'Porto Velho (GMT-4)' },
  { value: 'America/Rio_Branco', label: 'Rio Branco (GMT-5)' },
  { value: 'America/Noronha', label: 'Fernando de Noronha (GMT-2)' },
]

export const EMPTY_UNIT_DRAFT: UnitDraft = {
  customName: '',
  timezone: 'America/Sao_Paulo',
  primaryColor: '#FF6B00',
  secondaryColor: '#1F2937',
  tertiaryColor: '#FFF7ED',
  loadingType: 'MASCOT',
  zipCode: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
}
