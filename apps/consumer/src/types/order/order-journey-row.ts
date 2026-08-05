import type { OrderStatus } from './order-status'

export type OrderJourneyRowState = 'done' | 'current' | 'final' | 'ahead'

export type OrderJourneyRow = {
  status: OrderStatus
  at?: string
  state: OrderJourneyRowState
}
