import type { SetNewOrderState } from '@pages/NewOrder/types/SetNewOrderState.type'

export const stepLine = (
  set: SetNewOrderState,
  productId: string,
  by: number
) =>
  set((current) => ({
    lines: current.lines
      .map((line) =>
        line.productId === productId
          ? { ...line, quantity: line.quantity + by }
          : line
      )
      .filter(({ quantity }) => quantity > 0),
  }))
