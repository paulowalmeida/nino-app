import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useStoreAddress } from './useStoreAddress'
import { useStoreAddressMock } from './useStoreAddress.mock'

const useStore = vi.fn()

vi.mock('react-router', () => ({ useParams: () => ({ slug: 'loja' }) }))
vi.mock('@hooks/useStore/useStore', () => ({
  useStore: (...args: unknown[]) => useStore(...args),
}))

describe('useStoreAddress', () => {
  it('joins the store address into one line', () => {
    useStore.mockReturnValue({ store: useStoreAddressMock.store })
    const { result } = renderHook(() => useStoreAddress())
    expect(result.current).toBe(useStoreAddressMock.address)
  })

  it('is undefined while the store is loading', () => {
    useStore.mockReturnValue({ store: undefined })
    const { result } = renderHook(() => useStoreAddress())
    expect(result.current).toBeUndefined()
  })
})
