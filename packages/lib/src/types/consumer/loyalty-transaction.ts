import { LoyaltyTransactionType } from '../../enums'

export type LoyaltyTransaction = {
  id: string
  orderId: string | null
  type: LoyaltyTransactionType
  points: number
  description: string | null
  createdAt: string
  updatedAt: string
  tenant: { id: string; slug: string; customName: string | null }
}
