import { Chip } from '@nino/ds/components/Chip'
import { Skeleton } from '@nino/ds/components/Skeleton'
import type { ProductCategory } from '@custom_types/product/product-category'
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
      <Chip
        variant="tab"
        selected={value === null}
        onClick={() => onChange(null)}
        className={styles.chip}
      >
        Todas
      </Chip>

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
    </div>
  )
}
