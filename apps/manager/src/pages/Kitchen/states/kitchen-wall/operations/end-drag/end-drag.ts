import type { SetKitchenWallState } from '@pages/Kitchen/types/SetKitchenWallState.type'

export const endDrag = (set: SetKitchenWallState) =>
  set({
    draggingOrderId: null,
  })
