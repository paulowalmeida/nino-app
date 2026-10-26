import { MemoryRouter } from 'react-router'

import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useDeleteProduct } from '@pages/ProductDetail/hooks/useDeleteProduct/useDeleteProduct'

import { useProductRemoval } from './useProductRemoval'
import { productRemovalMock } from './useProductRemoval.mock'

const navigate = vi.fn()

vi.mock('react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router')>()),
  useNavigate: () => navigate,
}))
vi.mock('@pages/ProductDetail/hooks/useDeleteProduct/useDeleteProduct')

const mutateAsync = vi.fn()

const mockDeletion = (isPending: boolean) =>
  vi.mocked(useDeleteProduct).mockReturnValue({
    mutateAsync,
    isPending,
  } as unknown as ReturnType<typeof useDeleteProduct>)

const renderRemoval = () =>
  renderHook(
    () =>
      useProductRemoval(
        productRemovalMock.unitId,
        productRemovalMock.productId
      ),
    { wrapper: MemoryRouter }
  )

describe('useProductRemoval', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDeletion(false)
  })

  it('removes the item and goes back to the menu', async () => {
    mutateAsync.mockResolvedValue(undefined)
    const { result } = renderRemoval()

    let removed = false
    await act(async () => {
      removed = await result.current.removeProduct()
    })

    expect(removed).toBe(true)
    expect(navigate).toHaveBeenCalledWith('..', { relative: 'path' })
  })

  it('keeps the item on screen when the removal fails', async () => {
    mutateAsync.mockRejectedValue(new Error('offline'))
    const { result } = renderRemoval()

    let removed = true
    await act(async () => {
      removed = await result.current.removeProduct()
    })

    expect(removed).toBe(false)
    expect(navigate).not.toHaveBeenCalled()
  })

  it('exposes the removal in flight', () => {
    mockDeletion(true)

    const { result } = renderRemoval()

    expect(result.current.isRemoving).toBe(true)
  })
})
