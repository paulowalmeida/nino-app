import { create } from 'zustand'

import { arrangeStage } from '@pages/Kitchen/states/kitchen-wall/operations/arrange-stage/arrange-stage'
import { endDrag } from '@pages/Kitchen/states/kitchen-wall/operations/end-drag/end-drag'
import { startDrag } from '@pages/Kitchen/states/kitchen-wall/operations/start-drag/start-drag'
import type { KitchenStage } from '@pages/Kitchen/types/KitchenStage.type'
import type { KitchenWallState } from '@pages/Kitchen/types/KitchenWallState.type'

/**
 * WHY: quem arrasta é o card e quem acende é o trilho — ramos distintos da
 * árvore. A arrumação escolhida à mão precisa do mesmo ponto comum: cada
 * coluna consome a facade por conta própria, então state local não serviria.
 */
export const useKitchenWallStore = create<KitchenWallState>((set) => ({
  draggingOrderId: null,
  arrangement: {},
  startDrag: (orderId: string) => startDrag(set, orderId),
  endDrag: () => endDrag(set),
  arrangeStage: (stage: KitchenStage, orderIds: string[]) =>
    arrangeStage(set, stage, orderIds),
}))
