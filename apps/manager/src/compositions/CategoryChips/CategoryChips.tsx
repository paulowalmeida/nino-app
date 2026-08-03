import { Skeleton } from '@nino/ds/components/Skeleton'

import type { CategoryChipsProps } from './CategoryChips.types'

import styles from './CategoryChips.module.css'

/** Quatro fichas: o que cabe no trilho antes de a rolagem ser necessária. */
const GHOST_CHIPS = ['first', 'second', 'third', 'fourth']

/**
 * O mesmo trilho de fichas do balcão e da fila de pedidos: um toque troca a
 * lista inteira. Categoria é o recorte que a pessoa já tem na cabeça quando
 * abre o cardápio — antes disso era preciso rolar até achar o título da seção.
 */
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
