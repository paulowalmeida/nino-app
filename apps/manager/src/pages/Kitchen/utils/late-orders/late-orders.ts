import type { Order } from '@shared/types/order/order'
import { elapsedSince } from '@shared/utils/elapsed/elapsed'

export const countLateOrders = (orders: Order[]): number =>
  orders.filter(
    (order) => elapsedSince(order.acceptedAt ?? order.createdAt).isLate
  ).length
