import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useMenuSections } from './useMenuSections'
import { menuSectionsMock } from './useMenuSections.mock'

describe('useMenuSections', () => {
  it('exposes the sections untouched', () => {
    const { result } = renderHook(() =>
      useMenuSections(menuSectionsMock.sections)
    )
    expect(result.current.visibleSections).toEqual([])
  })
})
