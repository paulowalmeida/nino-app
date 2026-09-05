import { useEffect, useRef } from 'react'

import { Chip } from '@nino/ds/components/Chip'
import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { categoryIcon } from '@utils/category-icon'

import styles from './CategoryNav.module.css'

export const CategoryNav = () => {
  const { sections, activeId, goToSection } = useStorefrontFacade()
  const activeRef = useRef<HTMLButtonElement>(null)

  /* WHY: scrollIntoView centraliza o chip, mas também rola a página na
     vertical quando ele está parcialmente sob a barra fixa — o cardápio
     saltava sozinho ao rolar. Aqui só a trilha horizontal se move. */
  useEffect(() => {
    const chip = activeRef.current
    const track = chip?.parentElement
    if (!chip || !track) return
    track.scrollTo({
      left: chip.offsetLeft - (track.clientWidth - chip.clientWidth) / 2,
      behavior: 'smooth',
    })
  }, [activeId])

  return (
    <nav className={styles.nav} aria-label="Categorias do cardápio">
      <Text className={styles.railLabel}>Cardápio</Text>
      <Box direction="row" className={styles.track}>
        {sections.map((section) => {
          const isActive = section.id === activeId
          return (
            <Chip
              key={section.id}
              ref={isActive ? activeRef : undefined}
              variant="toggle"
              selected={isActive}
              borderless
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
