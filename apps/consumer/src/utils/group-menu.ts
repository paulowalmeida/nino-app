import type { MenuItem } from '@custom_types/menu/menu-item'
import type { MenuSection } from '@custom_types/menu/menu-section'

/**
 * Agrupa os itens ativos por categoria, preservando a ordem em que as
 * categorias aparecem. Item inativo não vai para a vitrine — o cliente só vê
 * o que dá para pedir agora.
 */
export const groupMenu = (items: MenuItem[]): MenuSection[] => {
  const sections: MenuSection[] = []
  const byId = new Map<string, MenuSection>()

  for (const item of items) {
    if (!item.isActive) continue

    let section = byId.get(item.category.id)
    if (!section) {
      section = { id: item.category.id, name: item.category.name, items: [] }
      byId.set(section.id, section)
      sections.push(section)
    }
    section.items.push(item)
  }

  return sections
}
