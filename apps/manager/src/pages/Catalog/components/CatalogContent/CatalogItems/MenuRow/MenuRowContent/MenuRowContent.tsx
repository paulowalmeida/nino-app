import { Link } from 'react-router'

import { Text } from '@nino/ds/components/Text'
import { ItemThumb } from '@shared/components/ItemThumb/ItemThumb'
import type { MenuItem } from '@shared/types/product/menu-item'

import styles from '@pages/Catalog/components/CatalogContent/CatalogItems/MenuRow/MenuRowContent/MenuRowContent.module.css'

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

type MenuRowContentProps = {
  item: MenuItem
  isImagePreloaded?: boolean
}

export const MenuRowContent = ({
  item,
  isImagePreloaded = false,
}: MenuRowContentProps) => (
  <Link to={item.id} className={styles.itemLink}>
    <ItemThumb
      name={item.name}
      imageUrl={item.images?.[0]?.url}
      fallbackUrl={item.fallbackUrl}
      isPreloaded={isImagePreloaded}
    />
    <Text as="span" className={styles.itemText}>
      <Text
        as="span"
        className={`${styles.itemName} ${
          !item.isActive ? styles.itemNameInactive : ''
        }`}
      >
        {item.name}
      </Text>
      {item.description && (
        <Text as="span" className={styles.itemDescription}>
          {item.description}
        </Text>
      )}
    </Text>
    <Text
      as="span"
      className={`${styles.price} ${!item.isActive ? styles.priceInactive : ''}`}
    >
      {brl.format(+item.price)}
    </Text>
  </Link>
)
