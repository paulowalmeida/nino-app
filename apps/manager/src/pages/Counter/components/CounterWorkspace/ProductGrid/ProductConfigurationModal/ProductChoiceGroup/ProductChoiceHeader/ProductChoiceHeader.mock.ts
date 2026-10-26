import type { MenuItemModifier } from '@shared/types/product/menu-item-modifier'

const choiceGroupMock = {
  id: 'modifier-sauces',
  name: 'Molhos',
  description: null,
  role: 'ADDITION',
  options: [],
} satisfies Omit<MenuItemModifier, 'minSelections' | 'maxSelections'>

export const singleExactGroupMock = {
  ...choiceGroupMock,
  minSelections: 1,
  maxSelections: 1,
} satisfies MenuItemModifier

export const pluralExactGroupMock = {
  ...choiceGroupMock,
  minSelections: 2,
  maxSelections: 2,
} satisfies MenuItemModifier

export const requiredRangeGroupMock = {
  ...choiceGroupMock,
  minSelections: 1,
  maxSelections: 3,
} satisfies MenuItemModifier

export const optionalRangeGroupMock = {
  ...choiceGroupMock,
  minSelections: 0,
  maxSelections: 3,
} satisfies MenuItemModifier
