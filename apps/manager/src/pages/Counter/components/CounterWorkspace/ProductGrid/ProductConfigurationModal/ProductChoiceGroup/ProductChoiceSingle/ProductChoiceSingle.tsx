import { RadioGroup } from '@nino/ds/components/RadioGroup'
import type { MenuItemModifier } from '@shared/types/product/menu-item-modifier'
import { brl } from '@shared/utils/money/money'

import styles from './ProductChoiceSingle.module.css'

type ProductChoiceSingleProps = {
  group: MenuItemModifier
  selectedOptionId: string | undefined
  onSelect: (optionId: string) => void
}

export const ProductChoiceSingle = ({
  group,
  selectedOptionId,
  onSelect,
}: ProductChoiceSingleProps) => (
  <RadioGroup
    className={styles.options}
    aria-labelledby={group.id}
    value={selectedOptionId ?? ''}
    onValueChange={onSelect}
    options={group.options.map((option) => ({
      value: option.id,
      label: option.name,
      trailing:
        Number(option.price) > 0
          ? `${group.role !== 'COMPOSITION' ? '+ ' : ''}${brl(option.price)}`
          : undefined,
    }))}
  />
)
