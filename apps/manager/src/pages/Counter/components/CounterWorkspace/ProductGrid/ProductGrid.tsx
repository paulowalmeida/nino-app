import { useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Input } from '@nino/ds/components/Input'
import { Skeleton } from '@nino/ds/components/Skeleton'
import {
  PRODUCT_GRID_SKELETON_CARDS,
  PRODUCT_GRID_SKELETON_TABS,
} from '@pages/Counter/constants/counter.constants'
import { useCounterFacade } from '@pages/Counter/facades/useCounterFacade/useCounterFacade'
import { CategoryChips } from '@shared/components/CategoryChips/CategoryChips'
import type { MenuItem } from '@shared/types/product/menu-item'

import { ProductCard } from './ProductCard/ProductCard'
import { ProductConfigurationModal } from './ProductConfigurationModal/ProductConfigurationModal'
import { ProductPreviewModal } from './ProductPreviewModal/ProductPreviewModal'

import styles from './ProductGrid.module.css'

export const ProductGrid = () => {
  const {
    sections,
    isPending,
    isError,
    isSuccess,
    lines,
    add: onPick,
    updateQuantity: onStep,
  } = useCounterFacade()
  const [current, setCurrent] = useState<string | null>(null)
  const [configuredItem, setConfiguredItem] = useState<MenuItem | null>(null)
  const [previewedItem, setPreviewedItem] = useState<MenuItem | null>(null)
  const [term, setTerm] = useState('')

  const active = current ?? sections[0]?.id ?? null
  const searching = term.trim().length > 0

  const query = term.trim().toLowerCase()
  const searchResults = sections
    .flatMap(({ items: list }) => list)
    .filter(({ name }) => name.toLowerCase().includes(query))
    .filter(({ isActive }) => isActive)

  const pickedIds = new Set(lines.map(({ productId }) => productId))
  const quantities = new Map(
    lines.map(({ productId }) => [
      productId,
      lines
        .filter((line) => line.productId === productId)
        .reduce((sum, line) => sum + line.quantity, 0),
    ])
  )

  const pickItem = (item: MenuItem) => {
    if (item.modifiers?.length) {
      setConfiguredItem(item)
      return
    }
    onPick(item)
  }

  const renderGrid = (items: MenuItem[]) => (
    <Box className={`${styles.grid} ${styles.resultsTop}`}>
      {items.map((item, index) => (
        <ProductCard
          key={item.id}
          item={item}
          index={index}
          isPicked={pickedIds.has(item.id)}
          quantity={quantities.get(item.id)}
          onPick={pickItem}
          onStep={item.modifiers?.length ? undefined : onStep}
          onPreviewStart={setPreviewedItem}
          onPreviewEnd={() => setPreviewedItem(null)}
        />
      ))}
    </Box>
  )

  if (isError) {
    return (
      <Box className={styles.feedback}>
        <Alert variant="error" title="Não foi possível carregar o cardápio">
          A consulta dos itens falhou ou excedeu o tempo limite. Tente
          novamente.
        </Alert>
      </Box>
    )
  }

  if (isPending || (!isError && !isSuccess)) {
    return (
      <Box className={styles.wrap}>
        <Box className={styles.controls}>
          <Skeleton className={styles.skeletonSearch} />

          <Box direction="row" className={styles.skeletonTabsRow}>
            {PRODUCT_GRID_SKELETON_TABS.map((tab) => (
              <Skeleton key={tab} className={styles.skeletonTab} />
            ))}
          </Box>
        </Box>

        <Box className={styles.grid}>
          {PRODUCT_GRID_SKELETON_CARDS.map((card) => (
            <Box key={card} className={styles.skeletonCard}>
              <Skeleton className={styles.skeletonPhoto} />
              <Box className={styles.skeletonFooter}>
                <Skeleton variant="text" className={styles.skeletonName} />
                <Skeleton variant="text" className={styles.skeletonPrice} />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    )
  }

  return (
    <Box className={styles.wrap}>
      <Box className={styles.controls}>
        <Input
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Buscar no cardápio…"
          aria-label="Buscar no cardápio"
          className={styles.search}
        />

        {!searching && (
          <CategoryChips
            categories={sections}
            value={active}
            onChange={setCurrent}
            allowAll={false}
          />
        )}
      </Box>

      {searching &&
        (searchResults.length === 0 ? (
          <Box className={styles.feedback}>
            <EmptyState>Nenhum item com esse nome no cardápio.</EmptyState>
          </Box>
        ) : (
          renderGrid(searchResults)
        ))}

      {!searching &&
        renderGrid(
          sections
            .find(({ id }) => id === active)
            ?.items.filter(({ isActive }) => isActive) ?? []
        )}

      <ProductPreviewModal
        item={previewedItem}
        onOpenChange={(open) => !open && setPreviewedItem(null)}
      />
      <ProductConfigurationModal
        item={configuredItem}
        onAdd={onPick}
        onOpenChange={(open) => !open && setConfiguredItem(null)}
      />
    </Box>
  )
}
