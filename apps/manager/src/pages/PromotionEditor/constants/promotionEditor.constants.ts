export const PER_CUSTOMER_OPTIONS = [
  { value: 'unlimited', label: 'Ilimitado' },
  { value: 'once', label: '1 vez' },
  { value: 'custom', label: 'Mais de uma vez' },
]

export const ZONE_SCOPE_OPTIONS = [
  {
    value: 'all',
    label: 'Todas as zonas',
    description: 'Inclui as zonas que você criar depois.',
  },
  { value: 'chosen', label: 'Só as zonas que eu escolher' },
]

export const EDITOR_TITLES = {
  create: 'Nova campanha',
  edit: 'Editar campanha',
  duplicate: 'Duplicar campanha',
} as const

export const EDITOR_SUBMIT_LABELS = {
  create: 'Criar campanha',
  edit: 'Salvar alterações',
  duplicate: 'Criar campanha',
} as const

export const EDITOR_GHOST_SECTIONS = ['benefit', 'zones', 'period', 'code']

export const CAMPAIGN_TYPE_OPTIONS = [
  { value: 'free-delivery', label: 'Frete grátis' },
  { value: 'discount', label: 'Desconto' },
  { value: 'gift', label: 'Brinde' },
]

export const DISCOUNT_KIND_OPTIONS = [
  { value: 'PERCENTAGE_DISCOUNT', label: 'Percentual' },
  { value: 'FIXED_DISCOUNT', label: 'Valor fixo' },
]

export const EDITOR_STEP_TITLES = {
  benefit: 'Benefício',
  zones: 'Zonas',
  period: 'Quando vale',
  rules: 'Regras',
} as const

// WHY: desconto e brinde valem para qualquer endereço, então não têm zonas.
export const EDITOR_STEPS_BY_TYPE = {
  'free-delivery': ['benefit', 'zones', 'period', 'rules'],
  discount: ['benefit', 'period', 'rules'],
  gift: ['benefit', 'period', 'rules'],
} as const

// CONSTRAINT: campos validados antes de sair de cada passo.
export const EDITOR_STEP_FIELDS = {
  benefit: ['minOrderValue', 'discountValue', 'maxDiscount', 'giftProductId'],
  zones: ['deliveryZoneIds'],
  period: ['startsAtDate', 'endsAtDate', 'dailyEndTime'],
  rules: ['code', 'perCustomerCount', 'totalLimit'],
} as const
