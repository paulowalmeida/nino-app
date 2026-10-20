import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useNewUnitFacade } from './useNewUnitFacade'

vi.mock(
  '@pages/NewUnit/hooks/useNewUnitSubmission/useNewUnitSubmission',
  () => ({
    useNewUnitSubmission: () => ({ submitStore: vi.fn() }),
  })
)
vi.mock(
  '@pages/NewUnit/hooks/useNewUnitTypeOptions/useNewUnitTypeOptions',
  () => ({
    useNewUnitTypeOptions: () => ({
      typeOptions: [{ value: 'restaurant', label: 'Restaurante' }],
      isPending: false,
    }),
  })
)

describe('useNewUnitFacade', () => {
  it('exposes the screen contract for types and submission', () => {
    const { result } = renderHook(() => useNewUnitFacade())

    expect(result.current.typeOptions).toEqual([
      { value: 'restaurant', label: 'Restaurante' },
    ])
    expect(result.current.isStoreTypesPending).toBe(false)
  })
})
