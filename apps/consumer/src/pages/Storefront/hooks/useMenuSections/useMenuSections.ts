import type { MenuSection } from '@custom_types/menu/menu-section'

import { useActiveSection } from '@pages/Storefront/hooks/useActiveSection/useActiveSection'

const sectionDomId = (id: string): string => `section-${id}`

/**
 * O cardápio como a tela precisa dele: as seções, qual delas está sob os
 * olhos agora, e como pular até uma. A busca vive na própria modal e nunca
 * filtra esta lista.
 */
export const useMenuSections = (sections: MenuSection[]) => {
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
    visibleSections: sections,
    activeId,
    goToSection,
    sectionDomId,
  }
}
