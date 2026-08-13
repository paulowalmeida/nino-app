import { Chip } from '@nino/ds/components/Chip'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { CATEGORY_CHIPS_GHOST_ITEMS } from '@constants/product.constants'
import styles from './CategoryChips.module.css'

type CategoryChipsProps = {
  /**
   * Só id e nome importam, então serve tanto para a categoria do cardápio
   * quanto para a seção do balcão — são a mesma trilha de filtro.
   */
  categories: { id: string; name: string }[]
  value: string | null
  onChange: (categoryId: string | null) => void
  isPending?: boolean
  /** O balcão filtra sempre por uma categoria; não tem "Todas". */
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
      <div className={styles.track} role="tablist" aria-label="Categorias">
        {CATEGORY_CHIPS_GHOST_ITEMS.map((chip) => (
          <Skeleton key={chip} className={styles.ghostChip} />
        ))}
      </div>
    )
  }

  return (
    <div className={styles.track} role="tablist" aria-label="Categorias">
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
    </div>
  )
}
