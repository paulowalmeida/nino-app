import { useState } from 'react'

import { EmptyState } from '@nino/ds/components/EmptyState'
import { Input } from '@nino/ds/components/Input'
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
  const [term, setTerm] = useState('')

  const active = current ?? sections[0]?.id ?? null
  const searching = term.trim().length > 0

  /*
   * Buscando, as categorias saem de cena e o cardápio inteiro vira uma lista
   * só: com sessenta bebidas ninguém quer lembrar em que aba o item estava —
   * quer digitar "coca" e tocar.
   */
  const items = searching
    ? sections
        .flatMap(({ items: list }) => list)
        .filter(({ name }) =>
          name.toLowerCase().includes(term.trim().toLowerCase())
        )
    : (sections.find(({ id }) => id === active)?.items ?? [])

  const visible = items.filter(({ isActive }) => isActive)

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
      <Input
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Buscar no cardápio…"
        aria-label="Buscar no cardápio"
        className={styles.search}
      />

      {!searching && (
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
      )}

      {searching && visible.length === 0 && (
        <EmptyState>Nenhum item com esse nome no cardápio.</EmptyState>
      )}

      <div className={styles.grid}>
        {visible.map((item, index) => (
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
