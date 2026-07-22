import type { MenuItem } from './menu-item'

export type MenuSection = {
  id: string
  name: string
  position: number
  items: MenuItem[]
}
