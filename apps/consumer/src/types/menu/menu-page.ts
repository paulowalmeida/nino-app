import type { MenuItem } from './menu-item'

export type MenuPage = {
  data: MenuItem[]
  pagination: {
    total: number
  }
}
