import type { SaleReceipt } from '@pages/Counter/types/SaleReceipt.type'
import type { SetCounterState } from '@pages/Counter/types/SetCounterState.type'

export const setLastSale = (set: SetCounterState, receipt: SaleReceipt) =>
  set({ lastSale: receipt })
