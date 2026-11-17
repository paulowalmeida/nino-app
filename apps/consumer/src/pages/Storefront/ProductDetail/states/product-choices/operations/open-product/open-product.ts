import type { ProductEdit } from '@pages/Storefront/ProductDetail/types/ProductEdit.type'
import type { SetProductChoicesState } from '@pages/Storefront/ProductDetail/types/SetProductChoicesState.type'

export const openProductChoices = (
  set: SetProductChoicesState,
  productId: string,
  editing?: ProductEdit
) =>
  set((state) =>
    state.productId === productId &&
    state.editingLineId === (editing?.lineId ?? null)
      ? {}
      : {
          productId,
          editingLineId: editing?.lineId ?? null,
          selections: editing?.selections ?? {},
          quantity: editing?.quantity ?? 1,
          notes: editing?.notes ?? '',
          isReplacementPending: false,
        }
  )

export const resetProductChoices = (set: SetProductChoicesState) =>
  set({
    productId: null,
    editingLineId: null,
    selections: {},
    quantity: 1,
    notes: '',
    isReplacementPending: false,
  })
