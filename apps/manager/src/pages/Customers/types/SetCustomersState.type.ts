import type { CustomersState } from './CustomersState.type'

export type SetCustomersState = (
  state:
    | Partial<CustomersState>
    | ((current: CustomersState) => Partial<CustomersState>)
) => void
