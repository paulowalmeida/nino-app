import type { CashSession } from '@shared/types/cash/cash-session.type'

import { openSessionMock } from '../../hooks/useCashSession/useCashSession.mock'

export const cashMovementsMock = { session: openSessionMock }

export const cashMovementsPagedMock: { session: CashSession } = {
  session: {
    ...openSessionMock,
    movements: Array.from({ length: 10 }, (_, index) => ({
      ...openSessionMock.movements[0],
      id: `movement-${index + 1}`,
      orderNumber: 100 + index,
    })),
  },
}
