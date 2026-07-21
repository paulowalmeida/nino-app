import type { MouseEvent } from 'react'

import { brl } from '@utils/money'
import { primaryImage } from '@utils/menu-image'

import type { MenuItemCardProps } from './MenuItemCard.types'

import styles from './MenuItemCard.module.css'

/**
 * O item como o cliente decide: texto à esquerda para ler, o botão de somar
 * logo depois (alvo fácil pro polegar) e a foto por último, só pra desejar —
 * o mesmo arranjo que a vitrine de exemplo do site usa.
 */
export const MenuItemCard = ({ item, onAdd, onSelect }: MenuItemCardProps) => {
  const image = primaryImage(item)

  const handleAdd = (event: MouseEvent) => {
    event.stopPropagation()
    onAdd(item)
  }

  return (
    <article
      className={styles.card}
      onClick={() => onSelect(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => event.key === 'Enter' && onSelect(item)}
    >
      <div className={styles.body}>
        <h3 className={styles.name}>{item.name}</h3>
        {item.description && (
          <p className={styles.description}>{item.description}</p>
        )}
        <span className={styles.price}>{brl(item.price)}</span>
      </div>

      <button
        type="button"
        className={styles.add}
        aria-label={`Adicionar ${item.name}`}
        onClick={handleAdd}
      >
        +
      </button>

      {image ? (
        <img src={image} alt="" className={styles.photo} />
      ) : (
        <div className={styles.photoFallback} aria-hidden="true" />
      )}
    </article>
  )
}
