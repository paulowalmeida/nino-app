import type { Order } from '@shared/types/order/order'
import type { OrderStep } from '@shared/types/order/order-step'

export const pendingOrderMock = {
  id: 'order-1',
  status: 'PENDING',
} as unknown as Order

export const acceptStepMock: OrderStep = {
  target: 'ACCEPTED',
  label: 'Confirmar pedido',
}
