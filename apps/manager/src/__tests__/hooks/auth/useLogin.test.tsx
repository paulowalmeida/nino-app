import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useLogin } from '@hooks/auth/useLogin'
import { AuthService } from '@services/auth.service'

import { authUser } from './useLogin.mock'

vi.mock('@services/auth.service')

const navigateMock = vi.fn()

vi.mock('react-router', () => ({
  useNavigate: () => navigateMock,
}))

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useLogin.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('navigates home after a successful login', async () => {
    // Arrange
    vi.mocked(AuthService.login).mockResolvedValue(authUser)
    const client = new QueryClient()
    const { result } = renderHook(() => useLogin(), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate({ email: 'maria@nino.delivery', password: '123' })

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(navigateMock).toHaveBeenCalledWith('/')
  })

  it('reports error without navigating on invalid credentials', async () => {
    // Arrange
    vi.mocked(AuthService.login).mockRejectedValue(new Error('unauthorized'))
    const client = new QueryClient()
    const { result } = renderHook(() => useLogin(), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate({ email: 'maria@nino.delivery', password: 'x' })

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
