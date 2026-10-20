import type { CashMovement } from '@shared/types/cash/cash-movement.type'

export const cashMovementDetail = (movement: CashMovement): string => {
  if (movement.reason) return movement.reason
  if (movement.tabLabel) return `Comanda ${movement.tabLabel}`
  if (movement.orderNumber !== null) return `Pedido #${movement.orderNumber}`
  return '—'
}
