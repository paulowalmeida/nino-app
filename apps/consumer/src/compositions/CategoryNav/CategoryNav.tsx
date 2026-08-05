import { useEffect, useRef } from 'react'

import { Chip } from '@nino/ds/components/Chip'
import type { MenuSection } from '@custom_types/menu/menu-section'

import styles from './CategoryNav.module.css'

type CategoryNavProps = {
  sections: MenuSection[]
  activeId: string | null
  onSelect: (id: string) => void
}

/**
 * As categorias do cardápio. Uma trilha horizontal que gruda no topo ao
 * rolar, em qualquer largura de tela — a categoria ativa se centraliza
 * sozinha para o próximo destino ficar à mão no polegar.
 */
export const CategoryNav = ({
  sections,
  activeId,
  onSelect,
}: CategoryNavProps) => {
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
      <p className={styles.railLabel}>Cardápio</p>
      <div className={styles.track}>
        {sections.map((section) => {
          const isActive = section.id === activeId
          return (
            <Chip
              key={section.id}
              ref={isActive ? activeRef : undefined}
              variant="tab"
              selected={isActive}
              onClick={() => onSelect(section.id)}
              className={`${styles.chip} ${isActive ? styles.chipOn : ''}`}
            >
              {section.name}
            </Chip>
          )
        })}
      </div>
    </nav>
  )
}
