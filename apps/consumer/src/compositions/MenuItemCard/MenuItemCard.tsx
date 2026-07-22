import type { MouseEvent } from 'react'

import { categoryIcon } from '@utils/category-icon'
import { brl } from '@utils/money'
import { primaryImage } from '@utils/menu-image'

import type { MenuItemCardProps } from './MenuItemCard.types'

import styles from './MenuItemCard.module.css'

/**
 * O item como o cliente decide: o texto à esquerda para ler, a foto emoldurada
 * à direita para desejar e o botão de somar ancorado no canto dela — o alvo do
 * polegar fica junto do que dá vontade. Sem foto, um ladrilho quente com o
 * emoji da categoria segura o lugar, em vez de um quadrado vazio.
 */
export const MenuItemCard = ({
  item,
  onAdd,
  onSelect,
  disabled = false,
  fallbackIcon,
}: MenuItemCardProps) => {
  const image = primaryImage(item)
  const glyph = categoryIcon(item.name) ?? fallbackIcon ?? '🍽️'

  const handleAdd = (event: MouseEvent) => {
    event.stopPropagation()
    if (disabled) return
    onAdd(item)
  }

  return (
    <article
      className={disabled ? `${styles.card} ${styles.disabled}` : styles.card}
      onClick={() => !disabled && onSelect(item)}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onKeyDown={(event) =>
        !disabled && event.key === 'Enter' && onSelect(item)
      }
    >
      <div className={styles.body}>
        <h3 className={styles.name}>{item.name}</h3>
        {item.description && (
          <p className={styles.description}>{item.description}</p>
        )}
        <span className={styles.price}>{brl(item.price)}</span>
      </div>

      <div className={styles.media}>
        {image ? (
          <img src={image} alt="" className={styles.photo} />
        ) : (
          <div className={styles.photoFallback} aria-hidden="true">
            <span className={styles.fallbackGlyph}>{glyph}</span>
          </div>
        )}

        <button
          type="button"
          className={styles.add}
          aria-label={`Adicionar ${item.name}`}
          disabled={disabled}
          onClick={handleAdd}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </article>
  )
}
