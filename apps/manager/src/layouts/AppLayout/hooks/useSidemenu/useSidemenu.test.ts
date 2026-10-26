import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

import { useSidemenu } from './useSidemenu'
import { sidemenuCounterMembershipMock } from './useSidemenu.mock'

vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit', () => ({
  useCurrentUnit: vi.fn(),
}))

describe('useSidemenu', () => {
  it('exposes only navigation items allowed for the current cargo', () => {
    vi.mocked(useCurrentUnit).mockReturnValue(sidemenuCounterMembershipMock)

    const { result } = renderHook(() => useSidemenu())
    const sections = result.current.groups.flatMap(({ items }) =>
      items.map(({ section }) => section)
    )

    expect(sections).toContain('balcao')
    expect(sections).not.toContain('produtos')
    expect(sections).not.toContain('empresa/informacoes')
  })
})
