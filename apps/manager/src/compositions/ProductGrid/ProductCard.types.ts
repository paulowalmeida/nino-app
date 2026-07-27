import type { MenuItem } from '@custom_types/product'

export type ProductCardProps = {
  item: MenuItem
  /** Posição na grade, só para escalonar a entrada. */
  index: number
  onPick: (item: MenuItem) => void
}
