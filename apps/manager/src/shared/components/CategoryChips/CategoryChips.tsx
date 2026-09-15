import { Box } from '@nino/ds/components/Box'
import { Chip } from '@nino/ds/components/Chip'
import { Icon } from '@nino/ds/components/Icon'
import { Skeleton } from '@nino/ds/components/Skeleton'
import type { ProductCategoryIcon } from '@nino/lib/types/product/product-category-icon'
import { toCategoryIcon } from '@shared/adapters/category-icon.adapter/category-icon.adapter'
import { CATEGORY_CHIPS_GHOST_ITEMS } from '@shared/constants/product.constants'
import { useHorizontalDragScroll } from '@shared/hooks/ui/useHorizontalDragScroll/useHorizontalDragScroll'

import styles from './CategoryChips.module.css'

type CategoryChipsProps = {
  categories: {
    id: string
    name: string
    icon?: ProductCategoryIcon | null
  }[]
  value: string | null
  onChange: (categoryId: string | null) => void
  isPending?: boolean
  allowAll?: boolean
}

export const CategoryChips = ({
  categories,
  value,
  onChange,
  isPending,
  allowAll = true,
}: CategoryChipsProps) => {
  const trackRef = useHorizontalDragScroll<HTMLDivElement>()

  if (isPending) {
    return (
      <Box className={styles.track} role="tablist" aria-label="Categorias">
        {CATEGORY_CHIPS_GHOST_ITEMS.map((chip) => (
          <Skeleton key={chip} className={styles.ghostChip} />
        ))}
      </Box>
    )
  }

  return (
    <Box
      ref={trackRef}
      className={styles.track}
      role="tablist"
      aria-label="Categorias"
    >
      {allowAll && (
        <Chip
          variant="tab"
          selected={value === null}
          onClick={() => onChange(null)}
          className={styles.chip}
          leadingIcon={<Icon name="grid" size="sm" />}
        >
          Todas
        </Chip>
      )}

      {categories.map(({ id, name, icon }) => (
        <Chip
          key={id}
          variant="tab"
          selected={id === value}
          onClick={() => onChange(id)}
          className={styles.chip}
          leadingIcon={
            <span aria-hidden="true">{toCategoryIcon(name, icon) ?? '🍽️'}</span>
          }
        >
          {name}
        </Chip>
      ))}
    </Box>
  )
}
