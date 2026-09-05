import { MenuItemCard } from './MenuItemCard/MenuItemCard'
import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { isOpen } from '@utils/store-info'
import type { MenuSection as MenuSectionType } from '@custom_types/menu/menu-section'
import { categoryIcon } from '@utils/category-icon'

import styles from './MenuSection.module.css'

type MenuSectionProps = {
  section: MenuSectionType
}

/** Uma categoria do cardápio: título, contagem de opções e a grade de itens. */
export const MenuSection = ({ section }: MenuSectionProps) => {
  const {
    quantityByProduct,
    isHoursPending,
    hours,
    store,
    addFromMenu,
    openProduct,
  } = useStorefrontFacade()
  if (!store) return null
  const storeOpen = isHoursPending || isOpen(store, hours)
  const domId = `section-${section.id}`
  const icon = categoryIcon(section.name, section.icon)

  return (
    <Box
      as="section"
      id={domId}
      className={styles.section}
      aria-label={section.name}
    >
      <Box direction="row" className={styles.sectionHead}>
        <Heading level={2} className={styles.sectionTitle}>
          {section.name}
        </Heading>
        <Text as="span" className={styles.sectionCount}>
          {section.items.length}{' '}
          {section.items.length === 1 ? 'opção' : 'opções'}
        </Text>
      </Box>
      <Box className={styles.items}>
        {section.items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            onAdd={addFromMenu}
            onSelect={openProduct}
            disabled={!storeOpen}
            fallbackIcon={icon}
            quantity={quantityByProduct[item.id] ?? 0}
          />
        ))}
      </Box>
    </Box>
  )
}
