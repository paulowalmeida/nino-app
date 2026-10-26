import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { AccountService } from './account.service'
import { accountPlanIdMock, subscriptionMock } from './account.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: { create: vi.fn(), get: vi.fn(), patch: vi.fn() },
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

describe(AccountService.requestSubscriptionInterest.name, () => {
  afterEach(() => vi.clearAllMocks())

  it('sends the consultative request to the subscription endpoint', async () => {
    const input = {
      contactName: 'Paulo',
      contactEmail: 'paulo@nino.delivery',
      preferredContactMethod: 'EMAIL' as const,
      unitCount: 12,
      needs: 'Operação com várias unidades',
    }
    vi.mocked(api.create).mockResolvedValue({ id: 'interest-1' })

    await AccountService.requestSubscriptionInterest(input)

    expect(api.create).toHaveBeenCalledWith('my/subscription/interest', input)
  })
})
