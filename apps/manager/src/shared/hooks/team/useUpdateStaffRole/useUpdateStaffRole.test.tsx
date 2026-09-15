import { createElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { StaffService } from '@shared/services/staff/staff.service'

import { useUpdateStaffRole } from './useUpdateStaffRole'
import { updateStaffRoleMock } from './useUpdateStaffRole.mock'

vi.mock('@shared/services/staff/staff.service', () => ({ StaffService: { updateStaffRole: vi.fn() } }))

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(QueryClientProvider, { client: new QueryClient() }, children)

describe(useUpdateStaffRole.name, () => {
  it('updates the role of the selected member', async () => {
    vi.mocked(StaffService.updateStaffRole).mockResolvedValue(undefined as never)
    const { result } = renderHook(() => useUpdateStaffRole(updateStaffRoleMock.unitId), { wrapper })
    await result.current.mutateAsync(updateStaffRoleMock)
    expect(StaffService.updateStaffRole).toHaveBeenCalledWith(
      updateStaffRoleMock.unitId,
      updateStaffRoleMock.userId,
      updateStaffRoleMock.role
    )
  })
})
