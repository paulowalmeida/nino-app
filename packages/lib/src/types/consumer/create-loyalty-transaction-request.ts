import { LoyaltyTransactionType } from '../../enums'

export type CreateLoyaltyTransactionRequest = {
  tenantId: string
  orderId?: string
  type: LoyaltyTransactionType
  points: number
  description?: string
}
