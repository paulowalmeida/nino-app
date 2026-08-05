import { MenuItemCard } from '@compositions/MenuItemCard/MenuItemCard'
import type { CartLine } from '@custom_types/cart/cart-line'
import type { MenuItem } from '@custom_types/menu/menu-item'
import type { MenuSection as MenuSectionType } from '@custom_types/menu/menu-section'
import { categoryIcon } from '@utils/category-icon'

import styles from './MenuSection.module.css'

type MenuSectionProps = {
  section: MenuSectionType
  domId: string
  cart: Record<string, CartLine>
  storeOpen: boolean
  onAdd: (item: MenuItem) => void
  onSelect: (item: MenuItem) => void
}

/** Uma categoria do cardápio: título, contagem de opções e a grade de itens. */
export const MenuSection = ({
  section,
  domId,
  cart,
  storeOpen,
  onAdd,
  onSelect,
}: MenuSectionProps) => {
  const icon = categoryIcon(section.name)

  return (
    <section
      id={domId}
      className={styles.section}
      aria-label={section.name}
    >
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>{section.name}</h2>
        <span className={styles.sectionCount}>
          {section.items.length}{' '}
          {section.items.length === 1 ? 'opção' : 'opções'}
        </span>
      </div>
      <div className={styles.items}>
        {section.items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            onAdd={onAdd}
            onSelect={onSelect}
            disabled={!storeOpen}
            fallbackIcon={icon}
            quantity={cart[item.id]?.quantity ?? 0}
          />
        ))}
      </div>
    </section>
  )
}
