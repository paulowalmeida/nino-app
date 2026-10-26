import { Box } from '@nino/ds/components/Box'
import type { MenuItemModifier } from '@custom_types/menu/menu-item-modifier'

import { ProductChoiceHeader } from './ProductChoiceHeader/ProductChoiceHeader'
import { ProductChoiceMultiple } from './ProductChoiceMultiple/ProductChoiceMultiple'
import { ProductChoiceSingle } from './ProductChoiceSingle/ProductChoiceSingle'
import styles from './ProductChoiceGroup.module.css'

type ProductChoiceGroupProps = {
  group: MenuItemModifier
}

export const ProductChoiceGroup = ({ group }: ProductChoiceGroupProps) => (
  <Box
    as="section"
    className={styles.productChoiceGroup}
    aria-labelledby={group.id}
  >
    <ProductChoiceHeader group={group} />
    {group.maxSelections === 1 ? (
      <ProductChoiceSingle group={group} />
    ) : (
      <ProductChoiceMultiple group={group} />
    )}
  </Box>
)
