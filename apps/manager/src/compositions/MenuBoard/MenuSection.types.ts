import type { MenuItem, MenuSection as MenuSectionData } from '@custom_types/product'

export type MenuSectionProps = {
  value: MenuSectionData
  tenantId: string | null
  name: string
  items: MenuItem[]
  sectionIndex: number
  onToggleAvailability: (id: string, isActive: boolean) => void
  onSectionDragEnd: () => void
}
