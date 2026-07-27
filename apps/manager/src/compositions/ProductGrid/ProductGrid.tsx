import { useState } from 'react'

import { EmptyState } from '@nino/ds/components/EmptyState'
import { Skeleton } from '@nino/ds/components/Skeleton'

import { ProductCard } from './ProductCard'
import type { ProductGridProps } from './ProductGrid.types'

import styles from './ProductGrid.module.css'
import motion from '@styles/motion.module.css'

/**
 * O cardápio do caixa: alvo grande, preço legível de longe e categorias
 * como filtro — quem opera não rola atrás do item, escolhe a aba e toca.
 */
export const ProductGrid = ({
  sections,
  isPending,
  onPick,
}: ProductGridProps) => {
  const [current, setCurrent] = useState<string | null>(null)

  const active = current ?? sections[0]?.id ?? null
  const items = sections.find(({ id }) => id === active)?.items ?? []

  if (isPending) {
    return (
      <div className={styles.loading}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className={styles.skeleton} />
        ))}
      </div>
    )
  }

  if (sections.length === 0) {
    return (
      <EmptyState>
        O cardápio está vazio. Cadastre itens no gestor para vender aqui.
      </EmptyState>
    )
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs} role="tablist" aria-label="Categorias">
        {sections.map(({ id, name }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={id === active}
            onClick={() => setCurrent(id)}
            className={`${motion.press} ${styles.tab} ${
              id === active ? styles.tabOn : ''
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {items
          .filter(({ isActive }) => isActive)
          .map((item, index) => (
            <ProductCard
              key={item.id}
              item={item}
              index={index}
              onPick={onPick}
            />
          ))}
      </div>
    </div>
  )
}
