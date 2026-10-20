import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useEmployeesData } from '@pages/Employees/hooks/useEmployeesData/useEmployeesData'

import { useEmployeesFacade } from './useEmployeesFacade'

vi.mock('@pages/Employees/hooks/useEmployeesData/useEmployeesData')
vi.mock('@shared/hooks/team/useInvite/useInvite', () => ({ useInvite: () => ({ mutateAsync: vi.fn() }) }))
vi.mock('@shared/hooks/team/useRemoveMember/useRemoveMember', () => ({ useRemoveMember: () => ({ mutate: vi.fn(), isPending: false }) }))
vi.mock('@shared/hooks/team/useUpdateStaffEmail/useUpdateStaffEmail', () => ({ useUpdateStaffEmail: () => ({ mutateAsync: vi.fn() }) }))
vi.mock('@shared/hooks/team/useUpdateStaffPosition/useUpdateStaffPosition', () => ({ useUpdateStaffPosition: () => ({ mutate: vi.fn(), isPending: false }) }))

describe(useEmployeesFacade.name, () => {
  it('exposes page data and existing team commands', () => {
    vi.mocked(useEmployeesData).mockReturnValue({
      unit: { role: 'UNIT_OWNER' },
      unitId: 'unit-1',
      staffEntries: [],
      courierEntries: [],
      isStaffPending: false,
      isCourierPending: false,
      isError: false,
    } as never)

    const { result } = renderHook(() => useEmployeesFacade())

    expect(result.current.unitId).toBe('unit-1')
    expect(result.current.invite).toBeTypeOf('function')
    expect(result.current.removeMember).toBeTypeOf('function')
  })
})
