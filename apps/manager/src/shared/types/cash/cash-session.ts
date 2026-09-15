import type { CashMovement } from '@shared/types/cash/cash-movement'

export type CashSession = {
  id: string
  unitId: string
  openedById: string
  openedByName: string
  closedById: string | null
  openingFloat: number
  salesTotal: number
  depositsTotal: number
  withdrawalsTotal: number
  expectedAmount: number
  countedAmount: number | null
  difference: number | null
  closingNote: string | null
  openedAt: string
  closedAt: string | null
  movements: CashMovement[]
}
