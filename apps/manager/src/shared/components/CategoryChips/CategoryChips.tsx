import { Box } from '@nino/ds/components/Box'
import { Chip } from '@nino/ds/components/Chip'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { CATEGORY_CHIPS_GHOST_ITEMS } from '@shared/constants/product.constants'

import styles from './CategoryChips.module.css'

type CategoryChipsProps = {
  categories: { id: string; name: string }[]
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
  if (isPending) {
    return (
      <Box
        direction="row"
        gap={2}
        className={styles.track}
        role="tablist"
        aria-label="Categorias"
      >
        {CATEGORY_CHIPS_GHOST_ITEMS.map((chip) => (
          <Skeleton key={chip} className={styles.ghostChip} />
        ))}
      </Box>
    )
  }

  return (
    <Box
      direction="row"
      gap={2}
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
        >
          Todas
        </Chip>
      )}

      {categories.map(({ id, name }) => (
        <Chip
          key={id}
          variant="tab"
          selected={id === value}
          onClick={() => onChange(id)}
          className={styles.chip}
        >
          {name}
        </Chip>
      ))}
    </Box>
  )
}
