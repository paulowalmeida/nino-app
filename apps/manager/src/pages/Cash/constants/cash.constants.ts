import type { CashMovementKind } from '@shared/types/cash/cash-movement-kind'

export const CASH_MOVEMENT_LABEL: Record<CashMovementKind, string> = {
  SALE: 'Venda em dinheiro',
  WITHDRAWAL: 'Sangria',
  DEPOSIT: 'Suprimento',
}

export const CASH_MOVEMENTS_PAGE_SIZE = 8
