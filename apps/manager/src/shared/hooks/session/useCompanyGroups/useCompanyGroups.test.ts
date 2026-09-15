import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCompanyGroups } from './useCompanyGroups'
import { membershipMocks } from './useCompanyGroups.mock'

vi.mock('@shared/states/session/session.state', () => ({
  useSessionStore: (selector: (state: { memberships: typeof membershipMocks }) => unknown) =>
    selector({ memberships: membershipMocks }),
}))

describe(useCompanyGroups.name, () => {
  it('groups memberships by company while preserving unit order', () => {
    const { result } = renderHook(() => useCompanyGroups())
    expect(result.current).toHaveLength(1)
    expect(result.current[0].units.map(({ unitId }) => unitId)).toEqual(['unit-1', 'unit-2'])
  })
})
