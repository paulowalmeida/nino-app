import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useMenu } from '@shared/hooks/product/useMenu/useMenu'
import { useProductCategoryOptions } from '@shared/hooks/product/useProductCategoryOptions/useProductCategoryOptions'

import { useProductDetail } from './useProductDetail'
import {
  categoryOptionsMock,
  menuItemMock,
  productDetailMock,
} from './useProductDetail.mock'

vi.mock('@shared/hooks/product/useMenu/useMenu')
vi.mock(
  '@shared/hooks/product/useProductCategoryOptions/useProductCategoryOptions'
)

const mockMenu = (menu: Partial<ReturnType<typeof useMenu>>) =>
  vi.mocked(useMenu).mockReturnValue(menu as ReturnType<typeof useMenu>)

const mockCategoryOptions = (
  options: Partial<ReturnType<typeof useProductCategoryOptions>>
) =>
  vi.mocked(useProductCategoryOptions).mockReturnValue(
    options as ReturnType<typeof useProductCategoryOptions>
  )

const renderDetail = (productId: string | undefined) =>
  renderHook(() => useProductDetail(productDetailMock.tenantId, productId))

describe('useProductDetail', () => {
  beforeEach(() => vi.clearAllMocks())

  it('reads the item from the menu and the categories from the API', () => {
    mockMenu({
      data: { data: [menuItemMock], pagination: { total: 1, page: 1, size: 1 } },
      isPending: false,
    })
    mockCategoryOptions({ categoryOptions: categoryOptionsMock })

    const { result } = renderDetail(productDetailMock.productId)

    expect(useMenu).toHaveBeenCalledWith(productDetailMock.tenantId)
    expect(useProductCategoryOptions).toHaveBeenCalledWith(
      productDetailMock.tenantId
    )
    expect(result.current.item).toBe(menuItemMock)
    expect(result.current.categoryOptions).toBe(categoryOptionsMock)
    expect(result.current.isReady).toBe(true)
    expect(result.current.isMissing).toBe(false)
  })

  it('reports a missing item when the menu has no such product', () => {
    mockMenu({
      data: { data: [menuItemMock], pagination: { total: 1, page: 1, size: 1 } },
      isPending: false,
    })
    mockCategoryOptions({ categoryOptions: categoryOptionsMock })

    const { result } = renderDetail(productDetailMock.unknownProductId)

    expect(result.current.item).toBeNull()
    expect(result.current.isMissing).toBe(true)
    expect(result.current.isReady).toBe(false)
  })

  it('holds both branches while the menu is still loading', () => {
    mockMenu({ data: undefined, isPending: true })
    mockCategoryOptions({ categoryOptions: [] })

    const { result } = renderDetail(productDetailMock.productId)

    expect(result.current.item).toBeNull()
    expect(result.current.isPending).toBe(true)
    expect(result.current.isMissing).toBe(false)
    expect(result.current.isReady).toBe(false)
  })
})
