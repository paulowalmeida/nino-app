import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { AccountService } from '@shared/services/account/account.service'

import { useSubscriptionActions } from './useSubscriptionActions'
import { subscriptionAfterMutationMock } from './useSubscriptionActions.mock'

vi.mock('@shared/services/account/account.service')

let queryClient: QueryClient

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe(useSubscriptionActions.name, () => {
  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    })
  })

  it('updates the subscription cache after changing the plan', async () => {
    vi.mocked(AccountService.changePlan).mockResolvedValue(
      subscriptionAfterMutationMock
    )
    const { result } = renderHook(() => useSubscriptionActions(), { wrapper })

    await act(async () => {
      await result.current.changePlan('plan-pro')
    })

    expect(AccountService.changePlan).toHaveBeenCalledWith('plan-pro')
    expect(
      queryClient.getQueryData(queryKeys.account.subscription())
    ).toEqual(subscriptionAfterMutationMock)
  })

  it('updates the subscription cache after cancellation', async () => {
    vi.mocked(AccountService.cancelSubscription).mockResolvedValue(
      subscriptionAfterMutationMock
    )
    const { result } = renderHook(() => useSubscriptionActions(), { wrapper })

    await act(async () => {
      await result.current.cancelPlan()
    })

    expect(AccountService.cancelSubscription).toHaveBeenCalledWith()
    expect(
      queryClient.getQueryData(queryKeys.account.subscription())
    ).toEqual(subscriptionAfterMutationMock)
  })

  it('exposes the failed mutation state without hiding the error', async () => {
    vi.mocked(AccountService.changePlan).mockRejectedValue(
      new Error('request failed')
    )
    const { result } = renderHook(() => useSubscriptionActions(), { wrapper })

    await act(async () => {
      await expect(result.current.changePlan('plan-pro')).rejects.toThrow(
        'request failed'
      )
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
