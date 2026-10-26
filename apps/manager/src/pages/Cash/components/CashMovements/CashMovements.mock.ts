import type { CashMovement } from '@shared/types/cash/cash-movement.type'

import { openSessionMock } from '../../hooks/useCashSession/useCashSession.mock'

export const cashMovementsMock = { movements: openSessionMock.movements }

export const cashMovementsPagedMock: { movements: CashMovement[] } = {
  movements: Array.from({ length: 10 }, (_, index) => ({
    ...openSessionMock.movements[0],
    id: `movement-${index + 1}`,
    orderNumber: 100 + index,
  })),
}
