import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AccountService } from '@shared/services/account/account.service'

import { useSubscriptionPlans } from './useSubscriptionPlans'
import { subscriptionPlansMock } from './useSubscriptionPlans.mock'

vi.mock('@shared/services/account/account.service', () => ({
  AccountService: { getPlans: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useSubscriptionPlans.name, () => {
  it('loads the available plans', async () => {
    vi.mocked(AccountService.getPlans).mockResolvedValue(subscriptionPlansMock)
    const { result } = renderHook(() => useSubscriptionPlans(), { wrapper })
    await waitFor(() => expect(result.current.data).toEqual(subscriptionPlansMock))
  })
})
