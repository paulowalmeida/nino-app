import type { SetCounterState } from '@pages/Counter/types/SetCounterState.type'

export const stepLine = (set: SetCounterState, productId: string, by: number) =>
  set((state) => ({
    lines: state.lines
      .map((line) =>
        line.productId === productId
          ? { ...line, quantity: line.quantity + by }
          : line
      )
      .filter(({ quantity }) => quantity > 0),
  }))
