import type { Promotion } from '@shared/types/marketing/promotion.type'

export const PROMOTION_TABS = ['active', 'scheduled', 'inactive'] as const

export const PROMOTION_TAB_LABELS = {
  active: 'Ativas',
  scheduled: 'Agendadas',
  inactive: 'Inativas',
} as const

export const PROMOTION_TAB_EMPTY = {
  active: 'Nenhuma campanha valendo agora. Crie uma em Nova campanha.',
  scheduled: 'Nenhuma campanha com início marcado para depois.',
  inactive: 'Pausadas, encerradas e esgotadas aparecem aqui.',
} as const

export const PROMOTION_STATE_BADGES: Partial<
  Record<Promotion['state'], { label: string; variant: 'warning' | 'default' | 'info' }>
> = {
  PAUSED: { label: 'Pausada', variant: 'warning' },
  ENDED: { label: 'Encerrada', variant: 'default' },
  EXHAUSTED: { label: 'Esgotada', variant: 'info' },
}

export const CAMPAIGN_TABLE_GHOST_ROWS = ['ghost-1', 'ghost-2', 'ghost-3']
