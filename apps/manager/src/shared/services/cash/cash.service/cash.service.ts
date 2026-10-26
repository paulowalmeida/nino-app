import { api } from '@shared/services/http/http.service'
import type { CashMovementInput } from '@shared/types/cash/cash-movement-input'
import type { CashSession } from '@shared/types/cash/cash-session.type'
import type { CloseCashRequest } from '@shared/types/cash/close-cash'
import type { OpenCashRequest } from '@shared/types/cash/open-cash'

export const CashService = {
  getCurrentSession: (unitId: string): Promise<CashSession | null> =>
    api.get<CashSession | null>(`units/${unitId}/cash-sessions/current`),

  getSessionByDate: (
    unitId: string,
    date: string
  ): Promise<CashSession | null> =>
    api.getAll<CashSession | null>(`units/${unitId}/cash-sessions/by-date`, {
      date,
    }),

  openSession: (
    unitId: string,
    data: OpenCashRequest
  ): Promise<CashSession> =>
    api.create<OpenCashRequest, CashSession>(
      `units/${unitId}/cash-sessions`,
      data
    ),

  addMovement: (
    unitId: string,
    sessionId: string,
    data: CashMovementInput
  ): Promise<CashSession> =>
    api.create<CashMovementInput, CashSession>(
      `units/${unitId}/cash-sessions/${sessionId}/movements`,
      data
    ),

  closeSession: (
    unitId: string,
    sessionId: string,
    data: CloseCashRequest
  ): Promise<CashSession> =>
    api.create<CloseCashRequest, CashSession>(
      `units/${unitId}/cash-sessions/${sessionId}/close`,
      data
    ),
}
