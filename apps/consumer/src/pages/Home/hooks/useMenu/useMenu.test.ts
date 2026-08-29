import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useMenu } from './useMenu'
import { useMenuMock } from './useMenu.mock'

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: undefined, isPending: false }),
}))

describe('useMenu', () => {
  it('returns no sections before the menu response exists', () => {
    const { result } = renderHook(() => useMenu(useMenuMock.tenantId))
    expect(result.current.sections).toEqual([])
    expect(result.current.isPending).toBe(false)
  })
})
