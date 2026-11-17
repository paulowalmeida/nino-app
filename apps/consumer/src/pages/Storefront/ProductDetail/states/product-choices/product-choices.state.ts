import { create } from 'zustand'

import type { ProductChoicesState } from '@pages/Storefront/ProductDetail/types/ProductChoicesState.type'
import {
  openProductChoices,
  resetProductChoices,
} from './operations/open-product/open-product'
import {
  setChoiceNotes,
  setChoiceQuantity,
} from './operations/order-line/order-line'
import {
  askReplacement,
  dismissReplacement,
} from './operations/replacement/replacement'
import { selectChoice, toggleChoice } from './operations/selection/selection'

export const useProductChoicesStore = create<ProductChoicesState>((set) => ({
  productId: null,
  editingLineId: null,
  selections: {},
  quantity: 1,
  notes: '',
  isReplacementPending: false,
  openProduct: (productId, editing) =>
    openProductChoices(set, productId, editing),
  selectChoice: (groupId, optionId) => selectChoice(set, groupId, optionId),
  toggleChoice: (groupId, optionId, limit) =>
    toggleChoice(set, groupId, optionId, limit),
  setQuantity: (quantity) => setChoiceQuantity(set, quantity),
  setNotes: (notes) => setChoiceNotes(set, notes),
  askReplacement: () => askReplacement(set),
  dismissReplacement: () => dismissReplacement(set),
  reset: () => resetProductChoices(set),
}))
