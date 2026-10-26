import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useProductDetail } from '@pages/ProductDetail/hooks/useProductDetail/useProductDetail'
import { menuItemMock } from '@pages/ProductDetail/hooks/useProductDetail/useProductDetail.mock'
import { useProductDetailSubmission } from '@pages/ProductDetail/hooks/useProductDetailSubmission/useProductDetailSubmission'
import { useProductRemoval } from '@pages/ProductDetail/hooks/useProductRemoval/useProductRemoval'
import { useRemoveProductImage } from '@pages/ProductDetail/hooks/useRemoveProductImage/useRemoveProductImage'
import { useUploadProductImage } from '@pages/ProductDetail/hooks/useUploadProductImage/useUploadProductImage'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'

import { useProductDetailFacade } from './useProductDetailFacade'
import { productDetailFacadeMock } from './useProductDetailFacade.mock'

vi.mock('react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router')>()),
  useParams: () => ({ productId: productDetailFacadeMock.productId }),
}))
vi.mock('@shared/hooks/session/useCurrentUnit/useCurrentUnit')
vi.mock('@pages/ProductDetail/hooks/useProductDetail/useProductDetail')
vi.mock(
  '@pages/ProductDetail/hooks/useProductDetailSubmission/useProductDetailSubmission'
)
vi.mock('@pages/ProductDetail/hooks/useProductRemoval/useProductRemoval')
vi.mock(
  '@pages/ProductDetail/hooks/useRemoveProductImage/useRemoveProductImage'
)
vi.mock(
  '@pages/ProductDetail/hooks/useUploadProductImage/useUploadProductImage'
)

const submitProduct = vi.fn()
const cancel = vi.fn()
const removeProduct = vi.fn()
const uploadImage = vi.fn()
const removeImage = vi.fn()

describe('useProductDetailFacade', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useProductDetail).mockReturnValue({
      item: menuItemMock,
      categoryOptions: [{ value: 'category-1', label: 'Lanches' }],
      isPending: false,
      isMissing: false,
      isReady: true,
    })
    vi.mocked(useProductDetailSubmission).mockReturnValue({
      submitProduct,
      cancel,
    })
    vi.mocked(useProductRemoval).mockReturnValue({
      removeProduct,
      isRemoving: false,
    })
    vi.mocked(useUploadProductImage).mockReturnValue({
      mutate: uploadImage,
      isPending: false,
    } as unknown as ReturnType<typeof useUploadProductImage>)
    vi.mocked(useRemoveProductImage).mockReturnValue({
      mutate: removeImage,
      isPending: true,
    } as unknown as ReturnType<typeof useRemoveProductImage>)
  })

  it('joins the item, its commands, and its photo under one boundary', () => {
    vi.mocked(useCurrentUnit).mockReturnValue({
      unitId: productDetailFacadeMock.unitId,
    } as unknown as ReturnType<typeof useCurrentUnit>)

    const { result } = renderHook(() => useProductDetailFacade())

    expect(useProductDetail).toHaveBeenCalledWith(
      productDetailFacadeMock.unitId,
      productDetailFacadeMock.productId
    )
    expect(useProductDetailSubmission).toHaveBeenCalledWith(
      productDetailFacadeMock.unitId,
      productDetailFacadeMock.productId
    )
    expect(useProductRemoval).toHaveBeenCalledWith(
      productDetailFacadeMock.unitId,
      productDetailFacadeMock.productId
    )
    expect(result.current.item).toBe(menuItemMock)
    expect(result.current.isReady).toBe(true)
    expect(result.current.submitProduct).toBe(submitProduct)
    expect(result.current.cancel).toBe(cancel)
    expect(result.current.removeProduct).toBe(removeProduct)
    expect(result.current.isRemoving).toBe(false)
    expect(result.current.uploadImage).toBe(uploadImage)
    expect(result.current.isUploadingImage).toBe(false)
    expect(result.current.removeImage).toBe(removeImage)
    expect(result.current.isRemovingImage).toBe(true)
  })

  it('asks nothing of the API with no unit in session', () => {
    vi.mocked(useCurrentUnit).mockReturnValue(null)

    renderHook(() => useProductDetailFacade())

    expect(useProductDetail).toHaveBeenLastCalledWith(
      null,
      productDetailFacadeMock.productId
    )
  })
})
