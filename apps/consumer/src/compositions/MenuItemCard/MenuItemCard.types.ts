import type { MenuItem } from '@custom_types/menu/menu-item'

export type MenuItemCardProps = {
  item: MenuItem
  onAdd: (item: MenuItem) => void
  onSelect: (item: MenuItem) => void
  /** Loja fechada: mostra o item apagado e não deixa pedir. */
  disabled?: boolean
  /** Emoji da categoria para o ladrilho quando o item não tem foto. */
  fallbackIcon?: string | null
}
