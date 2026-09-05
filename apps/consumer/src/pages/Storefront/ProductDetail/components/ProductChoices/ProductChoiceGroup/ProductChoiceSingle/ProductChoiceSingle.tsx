import { RadioGroup } from '@nino/ds/components/RadioGroup'
import type { MenuItemModifier } from '@custom_types/menu/menu-item-modifier'
import { useProductDetailFacade } from '@pages/Storefront/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
import { brl } from '@utils/money'

import styles from './ProductChoiceSingle.module.css'

type ProductChoiceSingleProps = {
  group: MenuItemModifier
}

export const ProductChoiceSingle = ({ group }: ProductChoiceSingleProps) => {
  const { selections, selectChoice } = useProductDetailFacade()

  return (
    <RadioGroup
      className={styles.options}
      aria-labelledby={group.id}
      value={selections[group.id]?.[0] ?? ''}
      onValueChange={(optionId) => selectChoice(group.id, optionId)}
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
}
