import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useActiveSection } from './useActiveSection'
import { activeSectionMock } from './useActiveSection.mock'

describe('useActiveSection', () => {
  it('starts with the first section', () => {
    const { result } = renderHook(() => useActiveSection(activeSectionMock.ids))
    expect(result.current).toBe('section-one')
  })
})
