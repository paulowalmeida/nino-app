import type { SetCounterState } from '@pages/Counter/types/SetCounterState.type'

export const stepLine = (set: SetCounterState, lineId: string, by: number) =>
  set((state) => ({
    lines: state.lines
      .map((line) =>
        (line.lineId ?? line.productId) === lineId
          ? { ...line, quantity: line.quantity + by }
          : line
      )
      .filter(({ quantity }) => quantity > 0),
  }))
