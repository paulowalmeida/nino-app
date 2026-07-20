import type { MenuSection } from '@custom_types/menu/menu-section'

export type CategoryNavProps = {
  sections: MenuSection[]
  activeId: string | null
  onSelect: (id: string) => void
}
