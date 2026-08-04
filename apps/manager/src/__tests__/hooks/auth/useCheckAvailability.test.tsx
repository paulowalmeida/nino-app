import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCheckAvailability } from '@hooks/auth/useCheckAvailability'
import { AuthService } from '@services/auth.service'

vi.mock('@services/auth.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useCheckAvailability.name, () => {
  it('reports which fields are already taken', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(AuthService.checkAvailability).mockResolvedValue({
      email: true,
      cpf: false,
    })
    const { result } = renderHook(() => useCheckAvailability(), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate({ email: 'maria@nino.delivery', cpf: '123' })

    // Assert
    await waitFor(() =>
      expect(result.current.data).toEqual({ email: true, cpf: false })
    )
  })

  it('surfaces failure without throwing', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(AuthService.checkAvailability).mockRejectedValue(
      new Error('network error')
    )
    const { result } = renderHook(() => useCheckAvailability(), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate({ email: 'maria@nino.delivery' })

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
