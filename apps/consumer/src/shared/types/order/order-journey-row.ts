import type { OrderStatus } from './order-status'

export type OrderJourneyRow = {
  status: OrderStatus
  at?: string
  state: 'done' | 'current' | 'final' | 'ahead'
}
