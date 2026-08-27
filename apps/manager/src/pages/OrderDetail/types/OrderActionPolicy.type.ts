import type { OrderStep } from '@shared/types/order/order-step'

export type OrderActionPolicy = {
  nextStep: OrderStep | null
  canAdvance: boolean
  canMarkPaid: boolean
  canCancelOrder: boolean
}
