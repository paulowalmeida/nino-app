import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { CashService } from './cash.service'
import { cashDateMock, cashUnitIdMock } from './cash.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: { get: vi.fn(), getAll: vi.fn(), create: vi.fn() },
}))

describe(CashService.getSessionByDate.name, () => {
  afterEach(() => vi.clearAllMocks())

  it('scopes the cash session query by unit and date', async () => {
    vi.mocked(api.getAll).mockResolvedValue(null)

    await CashService.getSessionByDate(cashUnitIdMock, cashDateMock)

    expect(api.getAll).toHaveBeenCalledWith(
      `units/${cashUnitIdMock}/cash-sessions/by-date`,
      { date: cashDateMock }
    )
  })
})
