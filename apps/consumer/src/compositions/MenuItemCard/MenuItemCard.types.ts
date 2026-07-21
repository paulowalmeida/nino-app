import type { MenuItem } from '@custom_types/menu/menu-item'

export type MenuItemCardProps = {
  item: MenuItem
  onAdd: (item: MenuItem) => void
  onSelect: (item: MenuItem) => void
}
