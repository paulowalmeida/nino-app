import { Box } from '@nino/ds/components/Box'
import type { MenuItemModifier } from '@shared/types/product/menu-item-modifier'

import { ProductChoiceHeader } from './ProductChoiceHeader/ProductChoiceHeader'
import { ProductChoiceMultiple } from './ProductChoiceMultiple/ProductChoiceMultiple'
import { ProductChoiceSingle } from './ProductChoiceSingle/ProductChoiceSingle'

import styles from './ProductChoiceGroup.module.css'

type ProductChoiceGroupProps = {
  group: MenuItemModifier
  selectedOptionIds: string[]
  isAtLimit: boolean
  onSelectSingle: (optionId: string) => void
  onToggleOption: (optionId: string, checked: boolean) => void
}

export const ProductChoiceGroup = ({
  group,
  selectedOptionIds,
  isAtLimit,
  onSelectSingle,
  onToggleOption,
}: ProductChoiceGroupProps) => (
  <Box role="group" aria-labelledby={group.id} className={styles.productChoiceGroup}>
    <ProductChoiceHeader
      group={group}
      selectedCount={selectedOptionIds.length}
    />
    {group.maxSelections === 1 && group.minSelections === 1 ? (
      <ProductChoiceSingle
        group={group}
        selectedOptionId={selectedOptionIds[0]}
        onSelect={onSelectSingle}
      />
    ) : (
      <ProductChoiceMultiple
        group={group}
        selectedOptionIds={selectedOptionIds}
        isAtLimit={isAtLimit}
        onToggle={onToggleOption}
      />
    )}
  </Box>
)
