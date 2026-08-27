import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AuthService } from '@shared/services/auth/auth.service'

import { useCheckAvailability } from './useCheckAvailability'
import {
  checkAvailabilityRequestMock,
  checkAvailabilityResponseMock,
} from './useCheckAvailability.mock'

vi.mock('@shared/services/auth/auth.service', () => ({
  AuthService: { checkAvailability: vi.fn() },
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: queryClient }, children)

describe('useCheckAvailability', () => {
  afterEach(() => vi.clearAllMocks())

  it('asks the API whether the typed data is already taken', async () => {
    vi.mocked(AuthService.checkAvailability).mockResolvedValue(
      checkAvailabilityResponseMock
    )
    const { result } = renderHook(() => useCheckAvailability(), { wrapper })

    result.current.mutate(checkAvailabilityRequestMock)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(
      vi.mocked(AuthService.checkAvailability).mock.calls[0][0]
    ).toEqual(checkAvailabilityRequestMock)
    expect(result.current.data).toBe(checkAvailabilityResponseMock)
  })
})
