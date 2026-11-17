import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Chip } from '@nino/ds/components/Chip'
import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { CategoryGlyph } from '@pages/Storefront/components/StoreMenu/CategoryGlyph/CategoryGlyph'

import styles from './CategoryNav.module.css'

export const CategoryNav = () => {
  const { visibleSections, activeId, goToSection } = useStorefrontFacade()
  const activeRef = useRef<HTMLButtonElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const chipsRef = useRef<HTMLDivElement>(null)
  const [fits, setFits] = useState(false)

  /* WHY: `justify-content: center` num container com overflow-x deixa o
     primeiro chip inalcançável; centralizar só quando tudo cabe, medindo. */
  useLayoutEffect(() => {
    const track = trackRef.current
    const chips = chipsRef.current
    if (!track || !chips) return
    const measure = () => setFits(chips.scrollWidth <= track.clientWidth)
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    observer.observe(chips)
    return () => observer.disconnect()
  }, [visibleSections])

  /* WHY: scrollIntoView centraliza o chip, mas também rola a página na
     vertical quando ele está parcialmente sob a barra fixa — o cardápio
     saltava sozinho ao rolar. Aqui só a trilha horizontal se move. */
  useEffect(() => {
    const chip = activeRef.current
    const track = trackRef.current
    if (!chip || !track || fits) return
    track.scrollTo({
      left: chip.offsetLeft - (track.clientWidth - chip.clientWidth) / 2,
      behavior: 'smooth',
    })
  }, [activeId, fits])

  return (
    <nav
      className={`${styles.categoryNav} ${fits ? styles.categoryNavFits : ''}`}
      aria-label="Categorias do cardápio"
    >
      <Text className="sr-only">
        Deslize horizontalmente para ver mais categorias.
      </Text>
      <Text className={styles.railLabel}>Cardápio</Text>
      <Box
        ref={trackRef}
        direction="row"
        className={`${styles.track} ${fits ? styles.trackFits : ''}`}
      >
        <Box ref={chipsRef} direction="row" className={styles.chips}>
          {visibleSections.map((section) => {
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
                  <CategoryGlyph name={section.name} icon={section.icon} />
                }
              >
                {section.name}
              </Chip>
            )
          })}
        </Box>
      </Box>
    </nav>
  )
}
