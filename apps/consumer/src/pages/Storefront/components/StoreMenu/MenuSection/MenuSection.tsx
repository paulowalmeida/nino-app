import { MenuItemCard } from './MenuItemCard/MenuItemCard'
import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { useStorefrontFacade } from '@pages/Storefront/facades/useStorefrontFacade/useStorefrontFacade'
import { isOpen } from '@utils/store-info'
import type { MenuSection as MenuSectionType } from '@custom_types/menu/menu-section'

import styles from './MenuSection.module.css'

type MenuSectionProps = {
  section: MenuSectionType
  /** Primeira seção da vitrine: os cards da primeira dobra entram em cascata. */
  animateEntrance?: boolean
}

/* WHY: só a primeira dobra anima; o resto entra parado para o cardápio não
   virar um desfile ao rolar */
const ENTRANCE_ITEMS = 6
const ENTRANCE_START_MS = 200
const ENTRANCE_STEP_MS = 50

/** Uma categoria do cardápio: título, contagem de opções e a grade de itens. */
export const MenuSection = ({
  section,
  animateEntrance = false,
}: MenuSectionProps) => {
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
  return (
    <Box
      as="section"
      id={domId}
      className={styles.menuSection}
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
        {section.items.map((item, index) => (
          <MenuItemCard
            key={item.id}
            item={item}
            onAdd={addFromMenu}
            onSelect={openProduct}
            disabled={!storeOpen}
            quantity={quantityByProduct[item.id] ?? 0}
            entranceDelay={
              animateEntrance && index < ENTRANCE_ITEMS
                ? ENTRANCE_START_MS + index * ENTRANCE_STEP_MS
                : undefined
            }
          />
        ))}
      </Box>
    </Box>
  )
}
