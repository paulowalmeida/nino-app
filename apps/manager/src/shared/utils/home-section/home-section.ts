import type { Membership } from '@shared/types/auth/membership'

/** Quem enxerga relatórios abre na visão geral; os demais, no balcão. */
export const homeSectionFor = ({
  permissions,
}: Pick<Membership, 'permissions'>): 'visao-geral' | 'balcao' =>
  permissions.includes('reports.view') ? 'visao-geral' : 'balcao'
