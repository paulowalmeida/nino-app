import type { MenuItem } from '@custom_types/menu/menu-item'

export const minimumProductPrice = (product: MenuItem): number =>
  (product.modifiers ?? []).reduce(
    (total, group) => {
      const minimum = group.minSelections ?? (group.isRequired ? 1 : 0)
      const cheapestRequired = [...group.options]
        .sort((left, right) => Number(left.price) - Number(right.price))
        .slice(0, minimum)
        .reduce((sum, option) => sum + Number(option.price), 0)

      return total + cheapestRequired
    },
    product.pricingType === 'COMPOSED' ? 0 : Number(product.price)
  )
