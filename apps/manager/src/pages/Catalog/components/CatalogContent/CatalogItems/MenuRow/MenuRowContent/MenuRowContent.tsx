import { Link } from 'react-router'

import { ItemThumb } from '@shared/components/ItemThumb/ItemThumb'
import type { MenuItem } from '@shared/types/product/menu-item'

import styles from '@pages/Catalog/components/CatalogContent/CatalogItems/MenuRow/MenuRowContent/MenuRowContent.module.css'

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

type MenuRowContentProps = {
  item: MenuItem
}

export const MenuRowContent = ({ item }: MenuRowContentProps) => (
  <Link to={item.id} className={styles.itemLink}>
    <ItemThumb name={item.name} imageUrl={item.images?.[0]?.url} />
    <span className={styles.itemText}>
      <span
        className={`${styles.itemName} ${
          !item.isActive ? styles.itemNameInactive : ''
        }`}
      >
        {item.name}
      </span>
      {item.description && (
        <span className={styles.itemDescription}>{item.description}</span>
      )}
    </span>
    <span
      className={`${styles.price} ${!item.isActive ? styles.priceInactive : ''}`}
    >
      {brl.format(+item.price)}
    </span>
  </Link>
)
