import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useInvite } from '@hooks/team/useInvite'
import { StaffService } from '@services/staff.service'

vi.mock('@services/staff.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useInvite.name, () => {
  it('invalidates the team queries on success', async () => {
    // Arrange
    const client = new QueryClient()
    const invalidateQueries = vi.spyOn(client, 'invalidateQueries')
    vi.mocked(StaffService.sendInvite).mockResolvedValue({
      id: 'invite-1',
      email: 'joana@example.com',
    })
    const { result } = renderHook(() => useInvite('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate({ email: 'joana@example.com', kind: 'STAFF' })

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['team', 'tenant-1'],
    })
  })

  it('reports the mutation as failed when the request errors', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(StaffService.sendInvite).mockRejectedValue(
      new Error('network error')
    )
    const { result } = renderHook(() => useInvite('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate({ email: 'joana@example.com', kind: 'COURIER' })

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
