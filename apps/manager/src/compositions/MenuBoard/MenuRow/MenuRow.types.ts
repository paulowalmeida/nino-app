import type { MenuItem } from '@custom_types/product'

export type MenuRowProps = {
  item: MenuItem
  index: number
  tenantId: string | null
  /** Sem categoria escolhida ou com busca ativa, a alça de arraste some. */
  canReorder: boolean
  onToggleAvailability: (id: string, isActive: boolean) => void
  onDragEnd: () => void
}
