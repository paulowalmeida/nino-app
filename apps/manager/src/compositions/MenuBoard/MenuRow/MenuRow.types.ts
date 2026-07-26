import type { MenuItem } from '@custom_types/product'

export type MenuRowProps = {
  item: MenuItem
  index: number
  sectionIndex: number
  tenantId: string | null
  onToggleAvailability: (id: string, isActive: boolean) => void
  onDragEnd: () => void
}
