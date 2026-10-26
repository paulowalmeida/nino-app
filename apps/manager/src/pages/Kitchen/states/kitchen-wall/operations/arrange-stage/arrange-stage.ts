import type { KitchenStage } from '@pages/Kitchen/types/KitchenStage.type'
import type { SetKitchenWallState } from '@pages/Kitchen/types/SetKitchenWallState.type'

export const arrangeStage = (
  set: SetKitchenWallState,
  stage: KitchenStage,
  orderIds: string[]
) =>
  set((state) => ({
    arrangement: { ...state.arrangement, [stage]: orderIds },
  }))
