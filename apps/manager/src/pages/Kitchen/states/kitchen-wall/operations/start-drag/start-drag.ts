import type { SetKitchenWallState } from '@pages/Kitchen/types/SetKitchenWallState.type'

/**
 * WHY: a altura da comanda no instante do toque vira o tamanho da vaga que os
 * trilhos reservam. Sem ela a vaga chutaria uma altura e o card pousaria num
 * buraco de outro tamanho.
 */
export const startDrag = (set: SetKitchenWallState, orderId: string) =>
  set({ draggingOrderId: orderId })
