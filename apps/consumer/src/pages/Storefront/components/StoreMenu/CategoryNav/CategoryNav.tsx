import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Text } from '@nino/ds/components/Text'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { CategoryGlyph } from '@pages/Storefront/components/StoreMenu/CategoryGlyph/CategoryGlyph'

import styles from './CategoryNav.module.css'

type CategoryNavProps = {
  /** Barra grudada no topo: a ilustração encolhe, ficam abas de texto. */
  compact?: boolean
}

export const CategoryNav = ({ compact = false }: CategoryNavProps) => {
  const { visibleSections, activeId, goToSection } = useStorefrontFacade()
  const activeRef = useRef<HTMLButtonElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const tilesRef = useRef<HTMLDivElement>(null)
  const [fits, setFits] = useState(false)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  /* WHY: um indicador só, que desliza até a aba ativa, em vez de um traço por
     aba que aparecia e sumia de uma vez. Mede a aba de novo quando a barra
     compacta ou o tamanho muda, porque a largura dela muda junto. */
  useLayoutEffect(() => {
    const tiles = tilesRef.current
    if (!tiles) return
    const measure = () => {
      const tile = activeRef.current
      const left = tile?.offsetLeft ?? 0
      const width = tile?.offsetWidth ?? 0
      /* WHY: `visibleSections` chega com referência nova a cada render; sem
         devolver o mesmo objeto quando nada mudou, o efeito vira loop */
      setIndicator((current) =>
        current.left === left && current.width === width
          ? current
          : { left, width }
      )
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(tiles)
    return () => observer.disconnect()
  }, [activeId, visibleSections, compact])

  /* WHY: `justify-content: center` num container com overflow-x deixa o
     primeiro item inalcançável; centralizar só quando tudo cabe, medindo. */
  useLayoutEffect(() => {
    const track = trackRef.current
    const tiles = tilesRef.current
    if (!track || !tiles) return
    const measure = () => setFits(tiles.scrollWidth <= track.clientWidth)
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    observer.observe(tiles)
    return () => observer.disconnect()
  }, [visibleSections, compact])

  /* WHY: scrollIntoView centraliza o item, mas também rola a página na
     vertical quando ele está parcialmente sob a barra fixa — o cardápio
     saltava sozinho ao rolar. Aqui só a trilha horizontal se move. */
  useEffect(() => {
    const tile = activeRef.current
    const track = trackRef.current
    if (!tile || !track || fits) return
    track.scrollTo({
      left: tile.offsetLeft - (track.clientWidth - tile.clientWidth) / 2,
      behavior: 'smooth',
    })
  }, [activeId, fits, compact])

  return (
    <nav
      className={`${styles.categoryNav} ${fits ? styles.categoryNavFits : ''} ${compact ? styles.categoryNavCompact : ''}`}
      aria-label="Categorias do cardápio"
    >
      <Text className="sr-only">
        Deslize horizontalmente para ver mais categorias.
      </Text>
      <Box
        ref={trackRef}
        direction="row"
        className={`${styles.track} ${fits ? styles.trackFits : ''}`}
      >
        <Box ref={tilesRef} direction="row" className={styles.tiles}>
          {visibleSections.map((section) => {
            const isActive = section.id === activeId
            return (
              <Button
                key={section.id}
                ref={isActive ? activeRef : undefined}
                variant="ghost"
                aria-current={isActive ? 'true' : undefined}
                onClick={() => goToSection(section.id)}
                className={`${styles.tile} ${isActive ? styles.tileOn : ''}`}
              >
                <CategoryGlyph
                  name={section.name}
                  icon={section.icon}
                  className={styles.tileArt}
                />
                <Text as="span" className={styles.tileLabel}>
                  {section.name}
                </Text>
              </Button>
            )
          })}
          <Box
            aria-hidden="true"
            className={styles.indicator}
            style={{
              width: indicator.width,
              transform: `translateX(${indicator.left}px)`,
              opacity: indicator.width ? 1 : 0,
            }}
          />
        </Box>
      </Box>
    </nav>
  )
}
