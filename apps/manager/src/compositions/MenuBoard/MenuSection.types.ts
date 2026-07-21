import type { MenuItem } from '@custom_types/product'

export type MenuSectionProps = {
  tenantId: string | null
  name: string
  items: MenuItem[]
  sectionIndex: number
  onToggleAvailability: (id: string, isActive: boolean) => void
}
