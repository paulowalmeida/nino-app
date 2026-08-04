import { Skeleton } from '@nino/ds/components/Skeleton'
import type { ProductCategory } from '@custom_types/product'

import styles from './CategoryChips.module.css'

const GHOST_CHIPS = ['first', 'second', 'third', 'fourth']

type CategoryChipsProps = {
  categories: ProductCategory[]
  value: string | null
  onChange: (categoryId: string | null) => void
  isPending?: boolean
}

export const CategoryChips = ({
  categories,
  value,
  onChange,
  isPending,
}: CategoryChipsProps) => {
  if (isPending) {
    return (
      <div className={styles.track} role="tablist" aria-label="Categorias">
        {GHOST_CHIPS.map((chip) => (
          <Skeleton key={chip} className={styles.ghostChip} />
        ))}
      </div>
    )
  }

  return (
    <div className={styles.track} role="tablist" aria-label="Categorias">
      <button
        type="button"
        role="tab"
        aria-selected={value === null}
        onClick={() => onChange(null)}
        className={`${styles.chip} ${value === null ? styles.current : ''}`}
      >
        Todas
      </button>

      {categories.map(({ id, name }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={id === value}
          onClick={() => onChange(id)}
          className={`${styles.chip} ${id === value ? styles.current : ''}`}
        >
          {name}
        </button>
      ))}
    </div>
  )
}
