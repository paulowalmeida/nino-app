import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useUnitDetailShellFacade } from './useUnitDetailShellFacade'
import { unitDetailShellFacadeMock } from './useUnitDetailShellFacade.mock'

vi.mock('@shared/hooks/session/useCurrentTenant/useCurrentTenant', () => ({
  useCurrentTenant: () => unitDetailShellFacadeMock.tenant,
}))

describe(useUnitDetailShellFacade.name, () => {
  it('names the unit the screen is framing', () => {
    const { result } = renderHook(() => useUnitDetailShellFacade())

    expect(result.current.tenant).toEqual(unitDetailShellFacadeMock.tenant)
  })
})
