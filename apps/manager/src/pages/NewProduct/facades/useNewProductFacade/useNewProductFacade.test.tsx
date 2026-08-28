import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCreateCategory } from '@pages/NewProduct/hooks/useCreateCategory/useCreateCategory'
import { useNewProductSubmission } from '@pages/NewProduct/hooks/useNewProductSubmission/useNewProductSubmission'
import { useProductCategoryOptions } from '@shared/hooks/product/useProductCategoryOptions/useProductCategoryOptions'
import { useCurrentTenant } from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

import { useNewProductFacade } from './useNewProductFacade'
import { newProductFacadeMock } from './useNewProductFacade.mock'

vi.mock('@shared/hooks/session/useCurrentTenant/useCurrentTenant')
vi.mock('@pages/NewProduct/hooks/useCreateCategory/useCreateCategory')
vi.mock(
  '@pages/NewProduct/hooks/useNewProductSubmission/useNewProductSubmission'
)
vi.mock(
  '@shared/hooks/product/useProductCategoryOptions/useProductCategoryOptions'
)

const submitProduct = vi.fn()
const cancel = vi.fn()
const createCategory = vi.fn()

describe('useNewProductFacade', () => {
  it('joins categories, creation, and submission under one boundary', () => {
    vi.mocked(useCurrentTenant).mockReturnValue({
      tenantId: newProductFacadeMock.tenantId,
    } as unknown as ReturnType<typeof useCurrentTenant>)
    vi.mocked(useProductCategoryOptions).mockReturnValue({
      categoryOptions: [{ value: 'category-1', label: 'Lanches' }],
      isPending: false,
    })
    vi.mocked(useNewProductSubmission).mockReturnValue({
      submitProduct,
      cancel,
    } as unknown as ReturnType<typeof useNewProductSubmission>)
    vi.mocked(useCreateCategory).mockReturnValue({
      mutateAsync: createCategory,
      isPending: false,
    } as unknown as ReturnType<typeof useCreateCategory>)

    const { result } = renderHook(() => useNewProductFacade())

    expect(useProductCategoryOptions).toHaveBeenCalledWith(
      newProductFacadeMock.tenantId
    )
    expect(useNewProductSubmission).toHaveBeenCalledWith(
      newProductFacadeMock.tenantId
    )
    expect(useCreateCategory).toHaveBeenCalledWith(
      newProductFacadeMock.tenantId
    )
    expect(result.current.categoryOptions).toHaveLength(1)
    expect(result.current.isCategoriesPending).toBe(false)
    expect(result.current.submitProduct).toBe(submitProduct)
    expect(result.current.cancel).toBe(cancel)
    expect(result.current.createCategory).toBe(createCategory)
    expect(result.current.isCreatingCategory).toBe(false)
  })

  it('asks nothing of the API with no tenant in session', () => {
    vi.mocked(useCurrentTenant).mockReturnValue(null)
    vi.mocked(useProductCategoryOptions).mockReturnValue({
      categoryOptions: [],
      isPending: true,
    })
    vi.mocked(useNewProductSubmission).mockReturnValue({
      submitProduct,
      cancel,
    } as unknown as ReturnType<typeof useNewProductSubmission>)
    vi.mocked(useCreateCategory).mockReturnValue({
      mutateAsync: createCategory,
      isPending: true,
    } as unknown as ReturnType<typeof useCreateCategory>)

    const { result } = renderHook(() => useNewProductFacade())

    expect(useProductCategoryOptions).toHaveBeenLastCalledWith(null)
    expect(result.current.isCategoriesPending).toBe(true)
    expect(result.current.isCreatingCategory).toBe(true)
  })
})
