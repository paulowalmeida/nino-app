import { useState } from 'react'

import { EmptyState } from '@nino/ds/components/EmptyState'
import { Input } from '@nino/ds/components/Input'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Tabs } from '@nino/ds/components/Tabs'
import type { MenuItem, MenuSection } from '@custom_types/product'

import { ProductCard } from './ProductCard/ProductCard'

import styles from './ProductGrid.module.css'

export type ProductGridProps = {
  sections: MenuSection[]
  isPending: boolean
  onPick: (item: MenuItem) => void
}

/** Three tabs and eight cards: what fills the counter's first screen. */
const SKELETON_TABS = ['first', 'second', 'third']
const SKELETON_CARDS = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
]

/**
 * The counter's menu: large targets, price readable from a distance, and
 * categories as a filter — whoever is operating doesn't scroll to find the
 * item, they pick the tab and tap.
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
   * While searching, categories step out and the whole menu becomes a
   * single list: with sixty drinks nobody wants to remember which tab an
   * item was registered under — they want to type "coke" and tap.
   */
  const query = term.trim().toLowerCase()
  const searchResults = sections
    .flatMap(({ items: list }) => list)
    .filter(({ name }) => name.toLowerCase().includes(query))
    .filter(({ isActive }) => isActive)

  const renderGrid = (items: MenuItem[]) => (
    <div className={`${styles.grid} ${styles.resultsTop}`}>
      {items.map((item, index) => (
        <ProductCard key={item.id} item={item} index={index} onPick={onPick} />
      ))}
    </div>
  )

  /*
   * Search and tabs stay drawn while loading: they don't depend on the
   * request, and hiding them to bring them back later makes the whole tray
   * jump half a screen mid-service.
   */
  if (isPending) {
    return (
      <div className={styles.wrap}>
        <Skeleton className={styles.skeletonSearch} />

        <div className={styles.skeletonTabsRow}>
          {SKELETON_TABS.map((tab) => (
            <Skeleton key={tab} className={styles.skeletonTab} />
          ))}
        </div>

        <div className={styles.grid}>
          {SKELETON_CARDS.map((card) => (
            <Skeleton key={card} className={styles.skeleton} />
          ))}
        </div>
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

      {searching &&
        (searchResults.length === 0 ? (
          <EmptyState>Nenhum item com esse nome no cardápio.</EmptyState>
        ) : (
          renderGrid(searchResults)
        ))}

      {!searching && (
        <Tabs
          value={active ?? undefined}
          onValueChange={setCurrent}
          className={styles.tabsRoot}
          tabs={sections.map((section) => ({
            value: section.id,
            label: section.name,
            content: renderGrid(
              section.items.filter(({ isActive }) => isActive)
            ),
          }))}
        />
      )}
    </div>
  )
}
