import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AuthService } from '@shared/services/auth/auth.service'

import { useSignup } from './useSignup'
import { signupRequestMock } from './useSignup.mock'

vi.mock('@shared/services/auth/auth.service', () => ({
  AuthService: { signup: vi.fn() },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })

  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useSignup', () => {
  it('sends the complete signup request to the auth service', async () => {
    vi.mocked(AuthService.signup).mockResolvedValue({
      id: 'user-1',
      name: 'Maria Souza',
    })
    const { result } = renderHook(() => useSignup(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(signupRequestMock)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(AuthService.signup).toHaveBeenCalled()
    expect(vi.mocked(AuthService.signup).mock.calls[0][0]).toEqual(
      signupRequestMock
    )
  })
})
