import type { StudioGroup } from '@pages/Units/types/StudioGroup.type'

/** A ordem da árvore do estúdio: identidade primeiro, publicação por último. */
export const STUDIO_GROUPS: readonly StudioGroup[] = [
  { id: 'themes', label: 'Ponto de partida' },
  { id: 'colors', label: 'Cores' },
  { id: 'assets', label: 'Logo e banner' },
  { id: 'loading', label: 'Carregamento' },
  { id: 'tracking', label: 'Acompanhamento' },
  { id: 'versions', label: 'Versões' },
]
