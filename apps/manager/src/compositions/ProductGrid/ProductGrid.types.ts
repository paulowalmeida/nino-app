import type { MenuItem, MenuSection } from '@custom_types/product'

export type ProductGridProps = {
  sections: MenuSection[]
  isPending: boolean
  onPick: (item: MenuItem) => void
}
