import type { CashMovementInput } from '@shared/types/cash/cash-movement-input'
import type { CloseCashRequest } from '@shared/types/cash/close-cash'

export const cashWithdrawalMock: CashMovementInput = {
  kind: 'WITHDRAWAL',
  amount: 30,
  reason: 'Pagamento do gás',
}

export const cashDepositMock: CashMovementInput = {
  kind: 'DEPOSIT',
  amount: 50,
}

export const cashClosingMock: CloseCashRequest = {
  countedAmount: 175,
  closingNote: 'Faltou troco',
}

export const cashOpeningFloatMock = 100
