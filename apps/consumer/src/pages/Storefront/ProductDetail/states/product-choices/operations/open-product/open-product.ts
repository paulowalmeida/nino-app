import type { SetProductChoicesState } from '@pages/Storefront/ProductDetail/types/SetProductChoicesState.type'

export const openProductChoices = (
  set: SetProductChoicesState,
  productId: string
) =>
  set((state) =>
    state.productId === productId
      ? {}
      : {
          productId,
          selections: {},
          quantity: 1,
          notes: '',
          isReplacementPending: false,
        }
  )

export const resetProductChoices = (set: SetProductChoicesState) =>
  set({
    productId: null,
    selections: {},
    quantity: 1,
    notes: '',
    isReplacementPending: false,
  })
