import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useStaff } from '@hooks/team/useStaff'
import { StaffService } from '@services/staff.service'

import { staffPage } from './useStaff.mock'

vi.mock('@services/staff.service')

const wrapWithClient = () => {
  const client = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return wrapper
}

describe(useStaff.name, () => {
  beforeEach(() => vi.clearAllMocks())

  it('lists the staff of the given tenant', async () => {
    // Arrange
    vi.mocked(StaffService.listStaff).mockResolvedValue(staffPage)

    // Act
    const { result } = renderHook(() => useStaff('tenant-1'), {
      wrapper: wrapWithClient(),
    })

    // Assert
    await waitFor(() => expect(result.current.data).toEqual(staffPage))
  })

  it('stays disabled with no tenant id', () => {
    // Arrange / Act
    const { result } = renderHook(() => useStaff(null), {
      wrapper: wrapWithClient(),
    })

    // Assert
    expect(result.current.fetchStatus).toBe('idle')
    expect(StaffService.listStaff).not.toHaveBeenCalled()
  })
})
