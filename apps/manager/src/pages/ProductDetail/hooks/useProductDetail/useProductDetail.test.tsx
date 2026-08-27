import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useMenu } from '@shared/hooks/product/useMenu/useMenu'

import { useProductDetail } from './useProductDetail'
import {
  menuItemMock,
  menuSectionsMock,
  productDetailMock,
} from './useProductDetail.mock'

vi.mock('@shared/hooks/product/useMenu/useMenu')

const mockMenu = (menu: Partial<ReturnType<typeof useMenu>>) =>
  vi.mocked(useMenu).mockReturnValue(menu as ReturnType<typeof useMenu>)

const renderDetail = (productId: string | undefined) =>
  renderHook(() => useProductDetail(productDetailMock.tenantId, productId))

describe('useProductDetail', () => {
  beforeEach(() => vi.clearAllMocks())

  it('reads the item and the categories from the menu already in cache', () => {
    mockMenu({
      data: { data: [menuItemMock], pagination: { total: 1, page: 1, size: 1 } },
      sections: menuSectionsMock,
      isPending: false,
    })

    const { result } = renderDetail(productDetailMock.productId)

    expect(useMenu).toHaveBeenCalledWith(productDetailMock.tenantId)
    expect(result.current.item).toBe(menuItemMock)
    expect(result.current.categoryOptions).toEqual([
      { value: 'category-1', label: 'Lanches' },
      { value: 'category-2', label: 'Bebidas' },
    ])
    expect(result.current.isReady).toBe(true)
    expect(result.current.isMissing).toBe(false)
  })

  it('reports a missing item when the menu has no such product', () => {
    mockMenu({
      data: { data: [menuItemMock], pagination: { total: 1, page: 1, size: 1 } },
      sections: menuSectionsMock,
      isPending: false,
    })

    const { result } = renderDetail(productDetailMock.unknownProductId)

    expect(result.current.item).toBeNull()
    expect(result.current.isMissing).toBe(true)
    expect(result.current.isReady).toBe(false)
  })

  it('holds both branches while the menu is still loading', () => {
    mockMenu({ data: undefined, sections: [], isPending: true })

    const { result } = renderDetail(productDetailMock.productId)

    expect(result.current.item).toBeNull()
    expect(result.current.isPending).toBe(true)
    expect(result.current.isMissing).toBe(false)
    expect(result.current.isReady).toBe(false)
  })
})
