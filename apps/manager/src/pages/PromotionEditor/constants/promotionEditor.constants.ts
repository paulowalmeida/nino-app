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
