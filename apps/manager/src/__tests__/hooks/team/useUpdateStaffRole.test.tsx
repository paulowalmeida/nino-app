import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { StaffMember } from '@custom_types/team/staff-member'
import { useUpdateStaffRole } from '@hooks/team/useUpdateStaffRole'
import { StaffService } from '@services/staff.service'

vi.mock('@services/staff.service')

const wrapWithClient = () => {
  const client = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return { client, wrapper }
}

describe(useUpdateStaffRole.name, () => {
  it('updates the role of a staff member', async () => {
    // Arrange
    vi.mocked(StaffService.updateStaffRole).mockResolvedValue(
      {} as unknown as StaffMember
    )
    const { client, wrapper } = wrapWithClient()
    const invalidateQueries = vi.spyOn(client, 'invalidateQueries')
    const { result } = renderHook(() => useUpdateStaffRole('tenant-1'), {
      wrapper,
    })

    // Act
    result.current.mutate({ userId: 'user-1', role: 'MANAGER' })

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(StaffService.updateStaffRole).toHaveBeenCalledWith(
      'tenant-1',
      'user-1',
      'MANAGER'
    )
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['team', 'tenant-1'],
    })
  })

  it('reports the error so the store can require an owner', async () => {
    // Arrange
    vi.mocked(StaffService.updateStaffRole).mockRejectedValue(
      new Error('tenant needs at least one owner')
    )
    const { wrapper } = wrapWithClient()
    const { result } = renderHook(() => useUpdateStaffRole('tenant-1'), {
      wrapper,
    })

    // Act
    result.current.mutate({ userId: 'user-1', role: 'STAFF' })

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
