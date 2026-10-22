import { useEffect, useRef, useState } from 'react'

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
import { useMenuImagesReady } from '@pages/Counter/hooks/ui/useMenuImagesReady/useMenuImagesReady'
import { CategoryChips } from '@shared/components/CategoryChips/CategoryChips'
import type { MenuItem } from '@shared/types/product/menu-item'
import { resolveApiAssetUrl } from '@shared/utils/api-asset-url/api-asset-url'

import { CounterEmptyMenu } from './CounterEmptyMenu/CounterEmptyMenu'
import { ProductCard } from './ProductCard/ProductCard'
import { ProductConfigurationModal } from './ProductConfigurationModal/ProductConfigurationModal'
import { ProductPreviewModal } from './ProductPreviewModal/ProductPreviewModal'

import styles from './ProductGrid.module.css'

const CATEGORY_SKELETON_MS = 180
const CATEGORY_REVEAL_MS = 420

export const ProductGrid = () => {
  const {
    sections,
    isMenuPending,
    isMenuError,
    isMenuSuccess,
    lines,
    add: onPick,
    updateQuantity: onStep,
  } = useCounterFacade()
  const [current, setCurrent] = useState<string | null>(null)
  const [configuredItem, setConfiguredItem] = useState<MenuItem | null>(null)
  const [previewedItem, setPreviewedItem] = useState<MenuItem | null>(null)
  const [term, setTerm] = useState('')
  const [categoryPhase, setCategoryPhase] = useState<
    'idle' | 'loading' | 'revealing'
  >('idle')
  const categoryTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { areMenuImagesReady, loadedSources } = useMenuImagesReady(sections)

  useEffect(
    () => () => {
      if (categoryTimer.current) clearTimeout(categoryTimer.current)
    },
    []
  )

  const active =
    current ??
    sections.find(({ items }) => items.some(({ isActive }) => isActive))?.id ??
    null
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

  const selectCategory = (id: string | null) => {
    if (id === active) return
    if (categoryTimer.current) clearTimeout(categoryTimer.current)
    setCurrent(id)
    setCategoryPhase('loading')
    categoryTimer.current = setTimeout(() => {
      setCategoryPhase('revealing')
      categoryTimer.current = setTimeout(() => {
        setCategoryPhase('idle')
        categoryTimer.current = null
      }, CATEGORY_REVEAL_MS)
    }, CATEGORY_SKELETON_MS)
  }

  const renderSkeletonGrid = (cards: string[], withTop = false) => (
    <Box
      className={`${styles.productGrid} ${withTop ? styles.resultsTop : ''}`}
    >
      {cards.map((card) => (
        <Box key={card} className={styles.skeletonCard}>
          <Skeleton className={styles.skeletonPhoto} />
          <Box className={styles.skeletonFooter}>
            <Skeleton variant="text" className={styles.skeletonName} />
            <Skeleton variant="text" className={styles.skeletonPrice} />
          </Box>
        </Box>
      ))}
    </Box>
  )

  const renderGrid = (items: MenuItem[], revealing = false) => (
    <Box className={`${styles.productGrid} ${styles.resultsTop}`}>
      {items.map((item, index) => (
        <Box
          key={item.id}
          className={revealing ? styles.categoryCardEnter : undefined}
          style={
            revealing
              ? { animationDelay: `${20 + Math.min(index, 5) * 20}ms` }
              : undefined
          }
        >
          <ProductCard
            item={item}
            isImagePreloaded={loadedSources?.has(
              item.images?.[0]?.url ?? resolveApiAssetUrl(item.fallbackUrl) ?? ''
            )}
            isPicked={pickedIds.has(item.id)}
            quantity={quantities.get(item.id)}
            onPick={pickItem}
            onStep={item.modifiers?.length ? undefined : onStep}
            onPreviewStart={setPreviewedItem}
            onPreviewEnd={() => setPreviewedItem(null)}
          />
        </Box>
      ))}
    </Box>
  )

  if (isMenuError) {
    return (
      <Box className={styles.feedback}>
        <Alert variant="error" title="Não foi possível carregar o cardápio">
          A consulta dos itens falhou ou excedeu o tempo limite. Tente
          novamente.
        </Alert>
      </Box>
    )
  }

  if (
    isMenuPending ||
    (!isMenuError && !isMenuSuccess) ||
    !areMenuImagesReady
  ) {
    return (
      <Box className={styles.wrap}>
        <Box className={styles.productGridControls}>
          <Skeleton className={styles.skeletonSearch} />

          <Box direction="row" className={styles.skeletonTabsRow}>
            {PRODUCT_GRID_SKELETON_TABS.map((tab) => (
              <Skeleton key={tab} className={styles.skeletonTab} />
            ))}
          </Box>
        </Box>

        {renderSkeletonGrid(PRODUCT_GRID_SKELETON_CARDS)}
      </Box>
    )
  }

  const hasActiveItems = sections.some(({ items }) =>
    items.some(({ isActive }) => isActive)
  )
  const activeItems =
    sections
      .find(({ id }) => id === active)
      ?.items.filter(({ isActive }) => isActive) ?? []

  if (!hasActiveItems) {
    return (
      <Box className={styles.feedback}>
        <CounterEmptyMenu />
      </Box>
    )
  }

  return (
    <Box className={styles.wrap}>
      <Box className={styles.productGridControls}>
        <Input
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Buscar no cardápio…"
          aria-label="Buscar no cardápio"
          className={styles.productGridSearch}
        />

        {!searching && (
          <CategoryChips
            categories={sections}
            value={active}
            onChange={selectCategory}
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
        (activeItems.length === 0 ? (
          <Box className={styles.feedback}>
            <EmptyState>Nenhum item ativo nesta categoria.</EmptyState>
          </Box>
        ) : (
          <Box className={styles.categoryContent}>
            {categoryPhase !== 'loading' &&
              renderGrid(activeItems, categoryPhase === 'revealing')}
            {categoryPhase !== 'idle' && (
              <Box
                className={`${styles.categorySkeleton} ${categoryPhase === 'revealing' ? styles.categorySkeletonExit : ''}`}
                aria-hidden="true"
                data-testid="category-skeleton"
              >
                {renderSkeletonGrid(
                  activeItems.map(({ id }) => id),
                  true
                )}
              </Box>
            )}
          </Box>
        ))}

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
