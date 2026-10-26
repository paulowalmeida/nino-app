import type { CashMovementKind } from '@shared/types/cash/cash-movement-kind'

export type CashMovementInput = {
  kind: Exclude<CashMovementKind, 'SALE'>
  amount: number
  reason?: string
}
