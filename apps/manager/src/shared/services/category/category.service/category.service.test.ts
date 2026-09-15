import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { CategoryService } from './category.service'
import {
  categoryListMock,
  productCategoryMock,
  removeCategoryMessageMock,
  reorderIdsMock,
  unitIdMock,
} from './category.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: {
    get: vi.fn(),
    create: vi.fn(),
    patch: vi.fn(),
    remove: vi.fn(),
  },
}))

describe('CategoryService', () => {
  afterEach(() => vi.clearAllMocks())

  it('listCategories: reads the unit categories for management', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(categoryListMock)

    // Act
    const result = await CategoryService.listCategories(unitIdMock)

    // Assert
    expect(api.get).toHaveBeenCalledWith(
      `units/${unitIdMock}/product-categories/manage`
    )
    expect(result).toBe(categoryListMock)
  })

  it('createCategory: posts the category name', async () => {
    // Arrange
    vi.mocked(api.create).mockResolvedValue(productCategoryMock)

    // Act
    const result = await CategoryService.createCategory(
      unitIdMock,
      'Salgados'
    )

    // Assert
    expect(api.create).toHaveBeenCalledWith(
      `units/${unitIdMock}/product-categories`,
      { name: 'Salgados' }
    )
    expect(result).toBe(productCategoryMock)
  })

  it('reorderCategories: patches the new category order', async () => {
    // Act
    await CategoryService.reorderCategories(unitIdMock, reorderIdsMock)

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `units/${unitIdMock}/product-categories/reorder`,
      { ids: reorderIdsMock }
    )
  })

  it('updateCategory: patches the category name by id', async () => {
    // Act
    await CategoryService.updateCategory(
      unitIdMock,
      'category-1',
      'Doces'
    )

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `units/${unitIdMock}/product-categories/category-1`,
      { name: 'Doces' }
    )
  })

  it('removeCategory: deletes the category by id', async () => {
    // Arrange
    vi.mocked(api.remove).mockResolvedValue(removeCategoryMessageMock)

    // Act
    const result = await CategoryService.removeCategory(
      unitIdMock,
      'category-1'
    )

    // Assert
    expect(api.remove).toHaveBeenCalledWith(
      `units/${unitIdMock}/product-categories/category-1`
    )
    expect(result).toBe(removeCategoryMessageMock)
  })
})
