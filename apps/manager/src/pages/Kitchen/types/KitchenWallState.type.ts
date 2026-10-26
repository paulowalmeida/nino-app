import type { KitchenStage } from '@pages/Kitchen/types/KitchenStage.type'

export type KitchenWallState = {
  draggingOrderId: string | null
  /** Ordem escolhida à mão em cada trilho; trilho ausente segue a natural. */
  arrangement: Partial<Record<KitchenStage, string[]>>
  startDrag: (orderId: string) => void
  endDrag: () => void
  arrangeStage: (stage: KitchenStage, orderIds: string[]) => void
}
