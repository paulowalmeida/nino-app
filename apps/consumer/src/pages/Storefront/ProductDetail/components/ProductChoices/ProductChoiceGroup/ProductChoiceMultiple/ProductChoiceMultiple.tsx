import { Box } from '@nino/ds/components/Box'
import { Checkbox } from '@nino/ds/components/Checkbox'
import { Label } from '@nino/ds/components/Label'
import { Text } from '@nino/ds/components/Text'
import type { MenuItemModifier } from '@custom_types/menu/menu-item-modifier'
import { useProductDetailFacade } from '@pages/Storefront/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
import { brl } from '@utils/money'

import styles from './ProductChoiceMultiple.module.css'

type ProductChoiceMultipleProps = {
  group: MenuItemModifier
}

export const ProductChoiceMultiple = ({
  group,
}: ProductChoiceMultipleProps) => {
  const { selections, toggleChoice } = useProductDetailFacade()
  const chosen = selections[group.id] ?? []

  return (
    <Box className={styles.options}>
      {group.options.map((option) => (
        <Label key={option.id} className={styles.option}>
          <Box className={styles.identity}>
            <Text as="span" className={styles.name}>
              {option.name}
            </Text>
            {Number(option.price) > 0 && (
              <Text as="span" className={styles.price}>
                {group.role !== 'COMPOSITION' ? '+ ' : ''}
                {brl(option.price)}
              </Text>
            )}
          </Box>
          <Checkbox
            checked={chosen.includes(option.id)}
            onCheckedChange={() =>
              toggleChoice(group.id, option.id, group.maxSelections)
            }
          />
        </Label>
      ))}
    </Box>
  )
}
