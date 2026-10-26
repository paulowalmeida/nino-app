import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useNewUnitSubmission } from './useNewUnitSubmission'

const mutateAsync = vi.fn().mockResolvedValue({ id: 'unit-1' })

vi.mock('@shared/hooks/store/useCreateStore/useCreateStore', () => ({
  useCreateStore: () => ({ mutateAsync }),
}))

describe('useNewUnitSubmission', () => {
  it('exposes the store submission workflow', async () => {
    const { result } = renderHook(() => useNewUnitSubmission())

    await expect(
      result.current.submitStore({
        customName: 'Nova unidade',
        slug: 'nova-unidade',
        typeId: 'restaurant',
        zipCode: '66000000',
        street: 'Rua A',
        number: '1',
        complement: '',
        neighborhood: 'Centro',
        city: 'Belém',
        state: 'PA',
      })
    ).resolves.toEqual({ status: 'success' })
    expect(mutateAsync).toHaveBeenCalled()
  })
})
