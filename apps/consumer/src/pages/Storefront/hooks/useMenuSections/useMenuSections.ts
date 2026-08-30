import type { MenuSection } from '@custom_types/menu/menu-section'

import { useActiveSection } from '@pages/Storefront/hooks/useActiveSection/useActiveSection'

const sectionDomId = (id: string): string => `section-${id}`

/**
 * O cardápio como a tela precisa dele: as seções que sobrevivem à busca, qual
 * delas está sob os olhos agora, e como pular até uma. O rastreio de scroll
 * usa as seções inteiras, não as filtradas — a régua de categorias some
 * durante a busca, então "ativa" só importa fora dela.
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
    sections.map((section) => sectionDomId(section.id))
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
