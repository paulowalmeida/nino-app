import type { MenuItem } from '@custom_types/product'

export type MenuRowProps = {
  item: MenuItem
  index: number
  /** Sem categoria escolhida ou com busca ativa, a alça de arraste some. */
  canReorder: boolean
  onToggleAvailability: (id: string, isActive: boolean) => void
  /** Só no desktop: no celular a exclusão fica na tela do item. */
  onDelete: (item: MenuItem) => void
  onDragEnd: () => void
}
