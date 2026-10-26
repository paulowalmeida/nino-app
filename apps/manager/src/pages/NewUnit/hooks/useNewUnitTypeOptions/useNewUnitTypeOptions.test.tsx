import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useNewUnitTypeOptions } from './useNewUnitTypeOptions'

vi.mock('@shared/hooks/store/useStoreTypes/useStoreTypes', () => ({
  useStoreTypes: () => ({
    data: [{ id: 'restaurant', name: 'Restaurante', description: null }],
    isPending: false,
  }),
}))

describe('useNewUnitTypeOptions', () => {
  it('exposes options ready for the new-unit form', () => {
    const { result } = renderHook(() => useNewUnitTypeOptions())

    expect(result.current).toEqual({
      typeOptions: [{ value: 'restaurant', label: 'Restaurante' }],
      isPending: false,
    })
  })
})
