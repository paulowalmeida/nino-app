import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useRemoveMember } from '@hooks/team/useRemoveMember'
import { CourierService } from '@services/courier.service'
import { StaffService } from '@services/staff.service'

vi.mock('@services/staff.service')
vi.mock('@services/courier.service')

const wrapWithClient = (client: QueryClient) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useRemoveMember.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('removes a staff member and invalidates the team queries', async () => {
    // Arrange
    const client = new QueryClient()
    const invalidateQueries = vi.spyOn(client, 'invalidateQueries')
    vi.mocked(StaffService.removeStaff).mockResolvedValue({
      message: 'removed',
    })
    const { result } = renderHook(() => useRemoveMember('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate({ id: 'staff-1', kind: 'STAFF' })

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(StaffService.removeStaff).toHaveBeenCalledWith(
      'tenant-1',
      'staff-1'
    )
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['team', 'tenant-1'],
    })
  })

  it('removes a courier through the courier service instead', async () => {
    // Arrange
    const client = new QueryClient()
    vi.mocked(CourierService.removeCourier).mockResolvedValue({
      message: 'removed',
    })
    const { result } = renderHook(() => useRemoveMember('tenant-1'), {
      wrapper: wrapWithClient(client),
    })

    // Act
    result.current.mutate({ id: 'courier-1', kind: 'COURIER' })

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(CourierService.removeCourier).toHaveBeenCalledWith(
      'tenant-1',
      'courier-1'
    )
    expect(StaffService.removeStaff).not.toHaveBeenCalled()
  })
})
