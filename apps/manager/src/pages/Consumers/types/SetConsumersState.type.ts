import type { ConsumersState } from './ConsumersState.type'

export type SetConsumersState = (
  state:
    | Partial<ConsumersState>
    | ((current: ConsumersState) => Partial<ConsumersState>)
) => void
