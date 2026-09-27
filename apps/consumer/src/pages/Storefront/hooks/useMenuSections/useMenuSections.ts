import type { MenuSection } from '@custom_types/menu/menu-section'

import { useActiveSection } from '@pages/Storefront/hooks/useActiveSection/useActiveSection'

const sectionDomId = (id: string): string => `section-${id}`

/**
 * O cardápio como a tela precisa dele: as seções que sobrevivem à busca, qual
 * delas está sob os olhos agora, e como pular até uma. Durante a busca, a
 * mesma lista filtrada alimenta os chips e o rastreio para não apontar para
 * uma categoria que não aparece nos resultados.
 */
export const useMenuSections = (sections: MenuSection[], search: string) => {
  const query = search.trim().toLowerCase()

  const visibleSections = query
    ? sections
        .map((section) => ({
          ...section,
          items: section.items.filter(({ name }) =>
            name.toLowerCase().includes(query)
          ),
        }))
        .filter((section) => section.items.length > 0)
    : sections

  const activeDomId = useActiveSection(
    visibleSections.map((section) => sectionDomId(section.id))
  )
  const activeId = activeDomId?.replace(/^section-/, '') ?? null

  const goToSection = (id: string): void => {
    document
      .getElementById(sectionDomId(id))
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return {
    visibleSections,
    activeId,
    goToSection,
    sectionDomId,
    isSearching: query.length > 0,
  }
}
