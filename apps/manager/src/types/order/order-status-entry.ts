import type { OrderStatusKey } from './order-queue-summary'

/** Uma passagem de status, com quem assinou. */
export type OrderStatusEntry = {
  id: string
  status: OrderStatusKey
  changedByRealm: 'OPERATIONAL' | 'BACKOFFICE' | 'CUSTOMER' | 'GUEST'
  changedById: string | null
  createdAt: string
}
