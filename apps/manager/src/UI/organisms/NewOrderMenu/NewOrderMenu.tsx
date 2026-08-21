import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { ItemThumb } from '@atoms/ItemThumb/ItemThumb'
import {
  NEW_ORDER_MENU_GHOST_ITEMS,
  NEW_ORDER_MENU_GHOST_SECTIONS,
} from '@constants/product.constants'
import type { MenuSection } from '@custom_types/product/menu-section'
import { brl } from '@utils/money'
import { riseDelay } from '@utils/rise-delay'

import styles from './NewOrderMenu.module.css'
import motion from '@styles/motion.module.css'

export type NewOrderMenuProps = {
  sections: MenuSection[]
  isPending: boolean
  onAdd: (item: { productId: string; name: string; unitPrice: string }) => void
}

export const NewOrderMenu = ({
  sections,
  isPending,
  onAdd,
}: NewOrderMenuProps) => (
  <section className={styles.menu} aria-label="Cardápio">
    {isPending &&
      NEW_ORDER_MENU_GHOST_SECTIONS.map((section) => (
        <div key={section} className={styles.section}>
          <Skeleton variant="text" className={styles.ghostSectionName} />

          <Box as="ul" direction="column">
            {NEW_ORDER_MENU_GHOST_ITEMS.map((item) => (
              <li key={item} className={styles.item}>
                <Skeleton className={styles.ghostThumb} />
                <Skeleton variant="text" className={styles.ghostItemName} />
                <Skeleton variant="text" className={styles.ghostItemPrice} />
                <Skeleton className={styles.ghostAddButton} />
              </li>
            ))}
          </Box>
        </div>
      ))}

    {!isPending && sections.length === 0 && (
      <EmptyState>
        O cardápio está vazio. Cadastre um item antes de abrir pedido.
      </EmptyState>
    )}

    {sections.map(({ id, name, items }, sectionIndex) => (
      <div key={id} className={styles.section}>
        <h2
          className={`${motion.unroll} ${styles.sectionName}`}
          style={riseDelay(sectionIndex * 70)}
        >
          {name}
        </h2>

        <ul className={styles.items}>
          {items
            .filter(({ isActive }) => isActive)
            .map((item, index) => (
              <li
                key={item.id}
                className={`${motion.deal} ${styles.item}`}
                style={riseDelay(sectionIndex * 70 + index * 40 + 50)}
              >
                <ItemThumb name={item.name} imageUrl={item.images?.[0]?.url} />
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemPrice}>{brl(item.price)}</span>
                <Button
                  size="sm"
                  variant="outline"
                  aria-label={`Adicionar ${item.name}`}
                  className={motion.press}
                  onClick={() =>
                    onAdd({
                      productId: item.id,
                      name: item.name,
                      unitPrice: item.price,
                    })
                  }
                >
                  Adicionar
                </Button>
              </li>
            ))}
        </ul>
      </div>
    ))}
  </section>
)
