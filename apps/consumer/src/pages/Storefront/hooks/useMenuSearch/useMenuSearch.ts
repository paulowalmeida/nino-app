import type { MenuItem } from '@custom_types/menu/menu-item'
import type { MenuSection } from '@custom_types/menu/menu-section'
import { matchesQuery } from '@pages/Storefront/utils/menu-search/menu-search'

export type MenuSearchHit = { item: MenuItem; categoryName: string }

/**
 * Os itens do cardápio que casam com a busca, em lista única, na ordem da
 * vitrine. Casa por nome, descrição ou categoria — quem digita "bebidas"
 * quer ver as bebidas.
 */
export const useMenuSearch = (sections: MenuSection[], query: string) => {
  const hasQuery = query.trim().length > 0

  const searchResults: MenuSearchHit[] = hasQuery
    ? sections.flatMap((section) =>
        section.items
          .filter(
            (item) =>
              matchesQuery(item.name, query) ||
              matchesQuery(item.description, query) ||
              matchesQuery(section.name, query)
          )
          .map((item) => ({ item, categoryName: section.name }))
      )
    : []

  return { searchResults, hasSearchQuery: hasQuery }
}
