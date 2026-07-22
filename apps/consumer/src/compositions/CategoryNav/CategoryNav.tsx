import { useEffect, useRef } from 'react'

import type { CategoryNavProps } from './CategoryNav.types'

import styles from './CategoryNav.module.css'

/**
 * As categorias do cardápio. No celular é uma trilha horizontal que gruda no
 * topo ao rolar; a categoria ativa se centraliza sozinha para o próximo destino
 * ficar à mão no polegar. No desktop vira um índice vertical fixo à esquerda —
 * o menu lateral de um cardápio de verdade, só os nomes, sem ícone.
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
      <p className={styles.railLabel}>Cardápio</p>
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
