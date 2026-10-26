import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { StaffService } from '@shared/services/staff/staff.service'

import { useUpdateStaffEmail } from './useUpdateStaffEmail'
import { updateStaffEmailMock } from './useUpdateStaffEmail.mock'

vi.mock('@shared/services/staff/staff.service', () => ({ StaffService: { updateStaffEmail: vi.fn() } }))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useUpdateStaffEmail.name, () => {
  it('updates the email of the selected member', async () => {
    vi.mocked(StaffService.updateStaffEmail).mockResolvedValue(undefined as never)
    const { result } = renderHook(() => useUpdateStaffEmail(updateStaffEmailMock.unitId), { wrapper })
    await result.current.mutateAsync(updateStaffEmailMock)
    expect(StaffService.updateStaffEmail).toHaveBeenCalledWith(
      updateStaffEmailMock.unitId,
      updateStaffEmailMock.userId,
      updateStaffEmailMock.email
    )
  })
})
