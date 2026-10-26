import { Box } from '@nino/ds/components/Box'
import { Checkbox } from '@nino/ds/components/Checkbox'
import { Label } from '@nino/ds/components/Label'
import { Text } from '@nino/ds/components/Text'
import type { MenuItemModifier } from '@shared/types/product/menu-item-modifier'
import { brl } from '@shared/utils/money/money'

import styles from './ProductChoiceMultiple.module.css'

type ProductChoiceMultipleProps = {
  group: MenuItemModifier
  selectedOptionIds: string[]
  isAtLimit: boolean
  onToggle: (optionId: string, checked: boolean) => void
}

export const ProductChoiceMultiple = ({
  group,
  selectedOptionIds,
  isAtLimit,
  onToggle,
}: ProductChoiceMultipleProps) => (
  <Box className={styles.options}>
    {group.options.map((option) => {
      const isChecked = selectedOptionIds.includes(option.id)
      return (
        <Label key={option.id} className={styles.option}>
          <Box className={styles.identity}>
            <Text as="span" className={styles.name}>
              {option.name}
            </Text>
          </Box>
          {Number(option.price) > 0 && (
            <Text as="span" className={styles.price}>
              {group.role !== 'COMPOSITION' ? '+ ' : ''}
              {brl(option.price)}
            </Text>
          )}
          <Checkbox
            checked={isChecked}
            disabled={!isChecked && isAtLimit}
            onCheckedChange={(checked) => onToggle(option.id, !!checked)}
          />
        </Label>
      )
    })}
  </Box>
)
