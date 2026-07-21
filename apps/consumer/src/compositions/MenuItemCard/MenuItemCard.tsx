import type { MouseEvent } from 'react'

import { brl } from '@utils/money'
import { primaryImage } from '@utils/menu-image'

import type { MenuItemCardProps } from './MenuItemCard.types'

import styles from './MenuItemCard.module.css'

/**
 * O item como o cliente decide: texto à esquerda para ler, foto à direita
 * para desejar, e o botão de somar no canto da foto — um toque, sem sair da
 * lista. Sem foto, o espaço vira só preço e ação, sem buraco.
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

      <div className={styles.media}>
        {image && <img src={image} alt="" className={styles.photo} />}
        <button
          type="button"
          className={styles.add}
          aria-label={`Adicionar ${item.name}`}
          onClick={handleAdd}
        >
          +
        </button>
      </div>
    </article>
  )
}
