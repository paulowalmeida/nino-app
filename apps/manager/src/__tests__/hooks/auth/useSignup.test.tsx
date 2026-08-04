import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useSignup } from '@hooks/auth/useSignup'
import { AuthService } from '@services/auth.service'

import { authUser } from './useLogin.mock'
import { signupRequest } from './useSignup.mock'

vi.mock('@services/auth.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useSignup.name, () => {
  it('creates the account and the company', async () => {
    // Arrange
    vi.mocked(AuthService.signup).mockResolvedValue(authUser)
    const client = new QueryClient()
    const { result } = renderHook(() => useSignup(), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate(signupRequest)

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(authUser))
  })

  it('reports the error when the cnpj is already taken', async () => {
    // Arrange
    vi.mocked(AuthService.signup).mockRejectedValue(new Error('conflict'))
    const client = new QueryClient()
    const { result } = renderHook(() => useSignup(), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate(signupRequest)

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
