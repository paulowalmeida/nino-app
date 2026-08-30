import type { AccountAddressesState } from './AccountAddressesState.type'

export type SetAccountAddressesState = (
  state:
    | Partial<AccountAddressesState>
    | ((current: AccountAddressesState) => Partial<AccountAddressesState>)
) => void
