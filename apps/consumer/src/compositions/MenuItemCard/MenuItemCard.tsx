import { brl } from '@utils/money'
import { primaryImage } from '@utils/menu-image'

import type { MenuItemCardProps } from './MenuItemCard.types'

import styles from './MenuItemCard.module.css'

/**
 * O item como o cliente decide: texto à esquerda para ler, foto à direita
 * para desejar, e o botão de somar no canto da foto — um toque, sem sair da
 * lista. Sem foto, o espaço vira só preço e ação, sem buraco.
 */
export const MenuItemCard = ({ item, onAdd }: MenuItemCardProps) => {
  const image = primaryImage(item)

  return (
    <article className={styles.card}>
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
          onClick={() => onAdd(item)}
        >
          +
        </button>
      </div>
    </article>
  )
}
