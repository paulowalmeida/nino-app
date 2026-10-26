import { LoyaltyTransactionType } from '../../enums'

export type CreateLoyaltyTransactionRequest = {
  unitId: string
  orderId?: string
  type: LoyaltyTransactionType
  points: number
  description?: string
}
