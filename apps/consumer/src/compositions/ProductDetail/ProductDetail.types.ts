import type { MenuItem } from '@custom_types/menu/menu-item'

export type ProductDetailProps = {
  item: MenuItem | null
  onClose: () => void
  onConfirm: (item: MenuItem, quantity: number) => void
}
