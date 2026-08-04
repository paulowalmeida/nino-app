import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useStaffDetail } from '@hooks/team/useStaffDetail'
import { StaffService } from '@services/staff.service'

import { staffDetail } from './useStaffDetail.mock'

vi.mock('@services/staff.service')

const wrapWithClient = () => {
  const client = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useStaffDetail.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('fetches the detail of the given staff member', async () => {
    // Arrange
    vi.mocked(StaffService.getById).mockResolvedValue(staffDetail)

    // Act
    const { result } = renderHook(
      () => useStaffDetail('tenant-1', 'user-1'),
      { wrapper: wrapWithClient() }
    )

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(staffDetail))
  })

  it('stays disabled with no user id', () => {
    // Arrange / Act
    const { result } = renderHook(() => useStaffDetail('tenant-1', ''), {
      wrapper: wrapWithClient(),
    })

    // Assert
    expect(result.current.fetchStatus).toBe('idle')
    expect(StaffService.getById).not.toHaveBeenCalled()
  })
})
