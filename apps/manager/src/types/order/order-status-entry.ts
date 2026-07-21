import type { OrderStatusKey } from './order-status-key'

/** Uma passagem de status, com quem assinou. */
export type OrderStatusEntry = {
  id: string
  status: OrderStatusKey
  changedByRealm: 'OPERATIONAL' | 'BACKOFFICE' | 'CUSTOMER' | 'GUEST'
  changedById: string | null
  createdAt: string
}
