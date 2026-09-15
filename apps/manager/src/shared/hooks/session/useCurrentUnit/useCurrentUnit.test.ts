import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCurrentUnit } from './useCurrentUnit'
import { currentUnitMock } from './useCurrentUnit.mock'

vi.mock('@shared/states/session/session.state', () => ({
  useSessionStore: (selector: (state: { memberships: typeof currentUnitMock[]; currentUnitId: string }) => unknown) =>
    selector({ memberships: [currentUnitMock], currentUnitId: currentUnitMock.unitId }),
}))

describe(useCurrentUnit.name, () => {
  it('returns the membership addressed by the current unit id', () => {
    const { result } = renderHook(() => useCurrentUnit())
    expect(result.current).toEqual(currentUnitMock)
  })
})
