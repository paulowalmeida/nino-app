import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AccountService } from '@shared/services/account/account.service'

import { useSubscription } from './useSubscription'
import { subscriptionHookMock } from './useSubscription.mock'

vi.mock('@shared/services/account/account.service', () => ({
  AccountService: { getSubscription: vi.fn() },
}))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useSubscription.name, () => {
  it('loads the current subscription', async () => {
    vi.mocked(AccountService.getSubscription).mockResolvedValue(subscriptionHookMock)
    const { result } = renderHook(() => useSubscription(), { wrapper })
    await waitFor(() => expect(result.current.data).toEqual(subscriptionHookMock))
  })
})
