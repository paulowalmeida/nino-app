import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useUnitsFacade } from './useUnitsFacade'

vi.mock('@shared/hooks/session/useLogout/useLogout', () => ({
  useLogout: () => ({ logout: vi.fn() }),
}))
vi.mock('@shared/states/session/session.state', () => ({
  useSessionStore: (selector: (state: { user: { name: string } }) => unknown) =>
    selector({ user: { name: 'Marina Silva' } }),
}))
vi.mock('@shared/hooks/session/useCurrentTenant/useCurrentTenant', () => ({
  useCurrentTenant: () => ({ tenantId: 'tenant-1' }),
}))
vi.mock('@pages/Units/hooks/useUnitsDomain/useUnitsDomain', () => ({
  useUnitsDomain: () => ({ groups: [], limit: {} }),
}))
vi.mock('@pages/Units/hooks/useUnitsStoreForm/useUnitsStoreForm', () => ({
  useUnitsStoreForm: () => ({ typeOptions: [], submitStore: vi.fn() }),
}))

describe(useUnitsFacade.name, () => {
  it('exposes the onboarding UI contract', () => {
    const { result } = renderHook(() => useUnitsFacade())
    expect(result.current.user).toEqual({ name: 'Marina Silva' })
    expect(result.current.typeOptions).toEqual([])
  })
})
