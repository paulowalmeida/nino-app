import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useEmployeesData } from './useEmployeesData'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit', () => ({ useCurrentUnit: () => ({ unitId: 'unit-1', role: 'UNIT_OWNER' }) }))
vi.mock('@shared/hooks/team/useStaff/useStaff', () => ({ useStaff: () => ({ data: { data: [] }, isPending: false, isError: false }) }))
vi.mock('@shared/hooks/team/useCouriers/useCouriers', () => ({ useCouriers: () => ({ data: { data: [] }, isPending: false, isError: false }) }))
vi.mock('@shared/states/session/session.state', () => ({ useSessionStore: (selector: (state: { user: { id: string } }) => unknown) => selector({ user: { id: 'user-1' } }) }))

describe(useEmployeesData.name, () => {
  it('assembles unit roster data and query state', () => {
    const { result } = renderHook(() => useEmployeesData())
    expect(result.current.unitId).toBe('unit-1')
    expect(result.current.staffEntries).toEqual([])
    expect(result.current.isError).toBe(false)
  })
})
