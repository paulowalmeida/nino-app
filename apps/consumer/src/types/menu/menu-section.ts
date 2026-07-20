import type { MenuItem } from './menu-item'

/** Uma categoria com seus itens — como a vitrine agrupa o cardápio. */
export type MenuSection = {
  id: string
  name: string
  items: MenuItem[]
}
