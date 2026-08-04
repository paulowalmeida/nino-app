import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { CredentialInfo } from '@custom_types/account'
import { useUpdateStaffEmail } from '@hooks/team/useUpdateStaffEmail'
import { StaffService } from '@services/staff.service'

vi.mock('@services/staff.service')

const wrapWithClient = () => {
  const client = new QueryClient()
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return { client, wrapper }
}

describe(useUpdateStaffEmail.name, () => {
  it('updates the login e-mail of a staff member', async () => {
    // Arrange
    vi.mocked(StaffService.updateStaffEmail).mockResolvedValue(
      {} as unknown as CredentialInfo
    )
    const { wrapper } = wrapWithClient()
    const { result } = renderHook(() => useUpdateStaffEmail('tenant-1'), {
      wrapper,
    })

    // Act
    result.current.mutate({ userId: 'user-1', email: 'ana@nino.delivery' })

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(StaffService.updateStaffEmail).toHaveBeenCalledWith(
      'tenant-1',
      'user-1',
      'ana@nino.delivery'
    )
  })

  it('surfaces the failure without a toast for the caller to render inline', async () => {
    // Arrange
    vi.mocked(StaffService.updateStaffEmail).mockRejectedValue(
      new Error('conflict')
    )
    const { wrapper } = wrapWithClient()
    const { result } = renderHook(() => useUpdateStaffEmail('tenant-1'), {
      wrapper,
    })

    // Act
    result.current.mutate({ userId: 'user-1', email: 'taken@nino.delivery' })

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
