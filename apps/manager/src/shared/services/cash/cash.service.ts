import { api } from '@shared/services/http/http.service'
import type { CashMovementInput } from '@shared/types/cash/cash-movement-input'
import type { CashSession } from '@shared/types/cash/cash-session'
import type { CloseCashRequest } from '@shared/types/cash/close-cash'
import type { OpenCashRequest } from '@shared/types/cash/open-cash'

export const CashService = {
  getCurrentSession: (tenantId: string): Promise<CashSession | null> =>
    api.get<CashSession | null>(`tenants/${tenantId}/cash-sessions/current`),

  openSession: (
    tenantId: string,
    data: OpenCashRequest
  ): Promise<CashSession> =>
    api.create<OpenCashRequest, CashSession>(
      `tenants/${tenantId}/cash-sessions`,
      data
    ),

  addMovement: (
    tenantId: string,
    sessionId: string,
    data: CashMovementInput
  ): Promise<CashSession> =>
    api.create<CashMovementInput, CashSession>(
      `tenants/${tenantId}/cash-sessions/${sessionId}/movements`,
      data
    ),

  closeSession: (
    tenantId: string,
    sessionId: string,
    data: CloseCashRequest
  ): Promise<CashSession> =>
    api.create<CloseCashRequest, CashSession>(
      `tenants/${tenantId}/cash-sessions/${sessionId}/close`,
      data
    ),
}
