import { MemoryRouter } from 'react-router'

import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useReplaceProductModifiers } from '@pages/ProductDetail/hooks/useReplaceProductModifiers/useReplaceProductModifiers'
import { useUpdateProduct } from '@pages/ProductDetail/hooks/useUpdateProduct/useUpdateProduct'

import { useProductDetailSubmission } from './useProductDetailSubmission'
import {
  productDetailValuesMock,
  productSubmissionMock,
} from './useProductDetailSubmission.mock'

const navigate = vi.fn()

vi.mock('react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router')>()),
  useNavigate: () => navigate,
}))
vi.mock('@pages/ProductDetail/hooks/useUpdateProduct/useUpdateProduct')
vi.mock(
  '@pages/ProductDetail/hooks/useReplaceProductModifiers/useReplaceProductModifiers'
)

const mutateAsync = vi.fn()
const replaceModifiers = vi.fn()

const renderSubmission = () =>
  renderHook(
    () =>
      useProductDetailSubmission(
        productSubmissionMock.unitId,
        productSubmissionMock.productId
      ),
    { wrapper: MemoryRouter }
  )

describe('useProductDetailSubmission', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useUpdateProduct).mockReturnValue({
      mutateAsync,
    } as unknown as ReturnType<typeof useUpdateProduct>)
    vi.mocked(useReplaceProductModifiers).mockReturnValue({
      mutateAsync: replaceModifiers,
    } as unknown as ReturnType<typeof useReplaceProductModifiers>)
    replaceModifiers.mockResolvedValue(undefined)
  })

  it('saves the edited item and goes back to the menu', async () => {
    mutateAsync.mockResolvedValue(undefined)
    const { result } = renderSubmission()

    let saved = false
    await act(async () => {
      saved = await result.current.submitProduct(productDetailValuesMock)
    })

    expect(saved).toBe(true)
    expect(mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'X-Tudo', price: 24.9, isActive: true })
    )
    expect(replaceModifiers).toHaveBeenCalledWith([])
    expect(navigate).toHaveBeenCalledWith('..', { relative: 'path' })
  })

  it('keeps the attendant on the form when saving fails', async () => {
    mutateAsync.mockRejectedValue(new Error('offline'))
    const { result } = renderSubmission()

    let saved = true
    await act(async () => {
      saved = await result.current.submitProduct(productDetailValuesMock)
    })

    expect(saved).toBe(false)
    expect(navigate).not.toHaveBeenCalled()
  })

  it('leaves the form behind when the attendant gives up', () => {
    const { result } = renderSubmission()

    act(() => result.current.cancel())

    expect(navigate).toHaveBeenCalledWith('..', { relative: 'path' })
  })
})
