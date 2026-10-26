import type { GiftProductOption } from '@pages/PromotionEditor/types/GiftProductOption.type'
import type { MenuItem } from '@shared/types/product/menu-item'
import { brl } from '@shared/utils/money/money'

// CONSTRAINT: a API recusa produto inativo ou com opção obrigatória como brinde.
export const toGiftProductOptions = (
  items: MenuItem[] = []
): GiftProductOption[] =>
  items
    .filter(
      ({ isActive, modifiers = [] }) =>
        isActive && modifiers.every(({ minSelections }) => minSelections === 0)
    )
    .map(({ id, name, price }) => ({
      value: id,
      name,
      label: `${name} · ${brl(price)}`,
    }))
