import { useEffect, useRef } from 'react'

import type { CategoryNavProps } from './CategoryNav.types'

import styles from './CategoryNav.module.css'

/**
 * A trilha de categorias que gruda no topo ao rolar: mesmo gesto da fila do
 * gestor. A categoria ativa se centraliza sozinha, para o próximo destino
 * estar sempre à mão no polegar.
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
    <nav className={styles.nav} aria-label="Categorias do cardápio">
      <ul className={styles.track}>
        {sections.map((section) => {
          const isActive = section.id === activeId
          return (
            <li key={section.id}>
              <button
                ref={isActive ? activeRef : undefined}
                type="button"
                aria-current={isActive}
                onClick={() => onSelect(section.id)}
                className={`${styles.chip} ${isActive ? styles.chipOn : ''}`}
              >
                {section.name}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
