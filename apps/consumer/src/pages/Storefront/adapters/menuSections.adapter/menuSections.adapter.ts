import type { MenuItem } from '@custom_types/menu/menu-item'
import type { MenuSection } from '@custom_types/menu/menu-section'

/**
 * Agrupa os itens ativos por categoria e ordena pela posição da própria
 * categoria — não pela ordem de chegada dos produtos, que é só a posição de
 * cada item dentro da sua categoria. Item inativo não vai para a vitrine —
 * o cliente só vê o que dá para pedir agora.
 */
export const menuSections = (items: MenuItem[]): MenuSection[] => {
  const sections: MenuSection[] = []
  const byId = new Map<string, MenuSection>()

  for (const item of items) {
    if (!item.isActive) continue

    let section = byId.get(item.category.id)
    if (!section) {
      section = {
        id: item.category.id,
        name: item.category.name,
        position: item.category.position,
        icon: item.category.icon,
        items: [],
      }
      byId.set(section.id, section)
      sections.push(section)
    }
    section.items.push(item)
  }

  return sections.sort((a, b) => a.position - b.position)
}
