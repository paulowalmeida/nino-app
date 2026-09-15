import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { AccountService } from './account.service'
import { accountPlanIdMock, subscriptionMock } from './account.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: { get: vi.fn(), patch: vi.fn() },
}))

describe(AccountService.changePlan.name, () => {
  afterEach(() => vi.clearAllMocks())

  it('sends the selected plan to the account endpoint', async () => {
    vi.mocked(api.patch).mockResolvedValue(subscriptionMock)

    await AccountService.changePlan(accountPlanIdMock)

    expect(api.patch).toHaveBeenCalledWith('my/subscription/plan', {
      planId: accountPlanIdMock,
    })
  })
})
