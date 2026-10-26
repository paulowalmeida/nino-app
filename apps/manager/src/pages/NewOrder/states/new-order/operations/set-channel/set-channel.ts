import type { SetNewOrderState } from '@pages/NewOrder/types/SetNewOrderState.type'
import type { OrderChannel } from '@shared/types/order/order-channel'

export const setChannel = (set: SetNewOrderState, channel: OrderChannel) =>
  set({ channel })
