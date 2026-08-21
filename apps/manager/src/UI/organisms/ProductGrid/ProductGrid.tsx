import { useState } from 'react'

import { EmptyState } from '@nino/ds/components/EmptyState'
import { Input } from '@nino/ds/components/Input'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Box } from '@nino/ds/components/Box'
import type { MenuItem } from '@custom_types/product/menu-item'
import type { MenuSection } from '@custom_types/product/menu-section'
import { CategoryChips } from '@molecules/CategoryChips/CategoryChips'
import { ProductCard } from '@molecules/ProductCard/ProductCard'
import { ProductPreviewModal } from '@molecules/ProductPreviewModal/ProductPreviewModal'
import {
  PRODUCT_GRID_SKELETON_CARDS,
  PRODUCT_GRID_SKELETON_TABS,
} from '@constants/product.constants'

import styles from './ProductGrid.module.css'

export type ProductGridProps = {
  sections: MenuSection[]
  isPending: boolean
  onPick: (item: MenuItem) => void
}

export const ProductGrid = ({
  sections,
  isPending,
  onPick,
}: ProductGridProps) => {
  const [current, setCurrent] = useState<string | null>(null)
  const [previewedItem, setPreviewedItem] = useState<MenuItem | null>(null)
  const [term, setTerm] = useState('')

  const active = current ?? sections[0]?.id ?? null
  const searching = term.trim().length > 0

  const query = term.trim().toLowerCase()
  const searchResults = sections
    .flatMap(({ items: list }) => list)
    .filter(({ name }) => name.toLowerCase().includes(query))
    .filter(({ isActive }) => isActive)

  const renderGrid = (items: MenuItem[]) => (
    <Box className={`${styles.grid} ${styles.resultsTop}`}>
      {items.map((item, index) => (
        <ProductCard
          key={item.id}
          item={item}
          index={index}
          onPick={onPick}
          onPreviewStart={setPreviewedItem}
          onPreviewEnd={() => setPreviewedItem(null)}
        />
      ))}
    </Box>
  )

  if (isPending) {
    return (
      <Box className={styles.wrap}>
        <Skeleton className={styles.skeletonSearch} />

        <Box direction="row" className={styles.skeletonTabsRow}>
          {PRODUCT_GRID_SKELETON_TABS.map((tab) => (
            <Skeleton key={tab} className={styles.skeletonTab} />
          ))}
        </Box>

        <Box className={styles.grid}>
          {PRODUCT_GRID_SKELETON_CARDS.map((card) => (
            <Skeleton key={card} className={styles.skeleton} />
          ))}
        </Box>
      </Box>
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
    <Box className={styles.wrap}>
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
        <>
          <CategoryChips
            categories={sections}
            value={active}
            onChange={setCurrent}
            allowAll={false}
          />

          {renderGrid(
            sections
              .find(({ id }) => id === active)
              ?.items.filter(({ isActive }) => isActive) ?? []
          )}
        </>
      )}

      <ProductPreviewModal
        item={previewedItem}
        onOpenChange={(open) => !open && setPreviewedItem(null)}
      />
    </Box>
  )
}
