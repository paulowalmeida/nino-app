import { useEffect, useRef } from 'react'

import { Chip } from '@nino/ds/components/Chip'
import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import { useHomeFacade } from '@pages/Home/facades/useHomeFacade/useHomeFacade'
import { useHomeSlug } from '@pages/Home/hooks/useHomeSlug/useHomeSlug'
import { useMenuSections } from '@pages/Home/hooks/useMenuSections/useMenuSections'
import { categoryIcon } from '@utils/category-icon'

import styles from './CategoryNav.module.css'

export const CategoryNav = () => {
  const { sections, search } = useHomeFacade(useHomeSlug())
  const { activeId, goToSection } = useMenuSections(sections, search)
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [activeId])

  return (
    <nav
      className={styles.nav}
      role="tablist"
      aria-label="Categorias do cardápio"
    >
      <Text className={styles.railLabel}>Cardápio</Text>
      <Box className={styles.track}>
        {sections.map((section) => {
          const isActive = section.id === activeId
          return (
            <Chip
              key={section.id}
              ref={isActive ? activeRef : undefined}
              variant="tab"
              selected={isActive}
              onClick={() => goToSection(section.id)}
              className={`${styles.chip} ${isActive ? styles.chipOn : ''}`}
              leadingIcon={
                <span aria-hidden="true">
                  {categoryIcon(section.name, section.icon) ?? '🍽️'}
                </span>
              }
            >
              {section.name}
            </Chip>
          )
        })}
      </Box>
    </nav>
  )
}
