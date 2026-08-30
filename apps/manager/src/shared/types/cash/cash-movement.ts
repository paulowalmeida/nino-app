import type { CashMovementKind } from '@shared/types/cash/cash-movement-kind'

export type CashMovement = {
  id: string
  kind: CashMovementKind
  amount: number
  reason: string | null
  orderId: string | null
  createdAt: string
}
