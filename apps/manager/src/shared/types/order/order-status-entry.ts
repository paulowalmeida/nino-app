import type { OrderStatusKey } from './order-status-key'

export type OrderStatusEntry = {
  id: string
  status: OrderStatusKey
  changedByRealm: 'OPERATIONAL' | 'BACKOFFICE' | 'CONSUMER' | 'GUEST'
  changedById: string | null
  createdAt: string
}
