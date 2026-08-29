import type { KitchenWallState } from '@pages/Kitchen/types/KitchenWallState.type'

export type SetKitchenWallState = (
  partial:
    | Partial<KitchenWallState>
    | ((state: KitchenWallState) => Partial<KitchenWallState>)
) => void
