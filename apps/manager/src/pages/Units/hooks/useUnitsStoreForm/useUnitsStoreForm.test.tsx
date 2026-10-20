import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ApiError } from '@nino/lib/utils/api-error'

import { useUnitsStoreForm } from './useUnitsStoreForm'

const mutateAsync = vi.hoisted(() => vi.fn())
vi.mock('@shared/hooks/store/useStoreTypes/useStoreTypes', () => ({
  useStoreTypes: () => ({
    data: [{ id: 'restaurant', name: 'Restaurante', description: null }],
  }),
}))
vi.mock('@shared/hooks/store/useCreateStore/useCreateStore', () => ({
  useCreateStore: () => ({ mutateAsync }),
}))

const validStoreForm = {
  customName: 'Café da Vila',
  slug: 'cafe-da-vila',
  typeId: 'restaurant',
  zipCode: '66000-000',
  street: 'Rua A',
  number: '1',
  complement: '',
  neighborhood: 'Centro',
  city: 'Belém',
  state: 'PA',
}

describe(useUnitsStoreForm.name, () => {
  it('returns presentation-ready type options', () => {
    const { result } = renderHook(() => useUnitsStoreForm())
    expect(result.current.typeOptions).toEqual([
      { value: 'restaurant', label: 'Restaurante' },
    ])
  })

  it('reports a successful creation', async () => {
    mutateAsync.mockResolvedValueOnce({ id: 'store-1' })
    const { result } = renderHook(() => useUnitsStoreForm())
    await expect(result.current.submitStore(validStoreForm)).resolves.toEqual({
      status: 'success',
    })
  })

  it('reports a duplicate slug', async () => {
    mutateAsync.mockRejectedValueOnce(new ApiError(409, 'taken'))
    const { result } = renderHook(() => useUnitsStoreForm())
    await expect(result.current.submitStore(validStoreForm)).resolves.toEqual({
      status: 'slug-taken',
    })
  })

  it('reports offline creation failures', async () => {
    mutateAsync.mockRejectedValueOnce(new Error('offline'))
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: false,
    })
    const { result } = renderHook(() => useUnitsStoreForm())
    await expect(result.current.submitStore(validStoreForm)).resolves.toEqual({
      status: 'offline',
    })
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true,
    })
  })

  it('reports generic creation failures', async () => {
    mutateAsync.mockRejectedValueOnce(new Error('failed'))
    const { result } = renderHook(() => useUnitsStoreForm())
    await expect(result.current.submitStore(validStoreForm)).resolves.toEqual({
      status: 'error',
    })
  })
})
