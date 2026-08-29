import type { CheckoutState } from '@pages/checkout/types/CheckoutState.type'

export type SetCheckoutState = (
  state:
    | Partial<CheckoutState>
    | ((current: CheckoutState) => Partial<CheckoutState>)
) => void
