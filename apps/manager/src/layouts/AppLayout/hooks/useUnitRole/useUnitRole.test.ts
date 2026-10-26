import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

import { useUnitRole } from './useUnitRole'
import { unitRoleMembershipMock } from './useUnitRole.mock'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit', () => ({
  useCurrentUnit: vi.fn(),
}))

describe('useUnitRole', () => {
  it('returns the role of the current unit membership', () => {
    vi.mocked(useCurrentUnit).mockReturnValue(unitRoleMembershipMock)

    const { result } = renderHook(() => useUnitRole())

    expect(result.current).toBe('MANAGER')
  })

  it('returns null when there is no current unit', () => {
    vi.mocked(useCurrentUnit).mockReturnValue(null)

    const { result } = renderHook(() => useUnitRole())

    expect(result.current).toBeNull()
  })
})
