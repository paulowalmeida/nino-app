import type { NewOrderState } from './NewOrderState.type'

export type SetNewOrderState = (
  state:
    | Partial<NewOrderState>
    | ((current: NewOrderState) => Partial<NewOrderState>)
) => void
