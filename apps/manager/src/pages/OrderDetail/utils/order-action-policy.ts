import type { OrderStatusKey } from '@shared/types/order/order-status-key'

export const canCancel = (status: OrderStatusKey): boolean =>
  status === 'PENDING' || status === 'ACCEPTED' || status === 'PREPARING'
