import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useUnitRole } from '../useUnitRole/useUnitRole'
import { useSidemenu } from './useSidemenu'
import { sidemenuRoleMock } from './useSidemenu.mock'

vi.mock('../useUnitRole/useUnitRole', () => ({
  useUnitRole: vi.fn(),
}))

describe('useSidemenu', () => {
  it('exposes only navigation items allowed for the current role', () => {
    vi.mocked(useUnitRole).mockReturnValue(sidemenuRoleMock)

    const { result } = renderHook(() => useSidemenu())
    const sections = result.current.groups.flatMap(({ items }) =>
      items.map(({ section }) => section)
    )

    expect(sections).toContain('balcao')
    expect(sections).not.toContain('produtos')
    expect(sections).not.toContain('empresa/informacoes')
  })
})
