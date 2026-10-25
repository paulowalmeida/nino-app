import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { ProductService } from './product.service'
import {
  createMenuItemRequestMock,
  menuItemImageMock,
  menuItemMock,
  menuPageMock,
  productIdMock,
  removeManyMessageMock,
  removeMessageMock,
  reorderIdsMock,
  replaceProductModifiersRequestMock,
  unitIdMock,
  updateMenuItemRequestMock,
} from './product.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: {
    getAll: vi.fn(),
    create: vi.fn(),
    createFormData: vi.fn(),
    patch: vi.fn(),
    remove: vi.fn(),
  },
}))

describe('ProductService', () => {
  afterEach(() => vi.clearAllMocks())

  it('listMenu: fetches every manager page and joins items', async () => {
    // Arrange
    const secondItem = { ...menuItemMock, id: 'product-2' }
    vi.mocked(api.getAll)
      .mockResolvedValueOnce({
        data: [menuItemMock],
        pagination: { total: 150 },
      })
      .mockResolvedValueOnce({
        data: [secondItem],
        pagination: { total: 150 },
      })

    // Act
    const result = await ProductService.listMenu(unitIdMock)

    // Assert
    expect(api.getAll).toHaveBeenNthCalledWith(
      1,
      `units/${unitIdMock}/products/manage`,
      { target: 'position', size: 100, page: 1 }
    )
    expect(api.getAll).toHaveBeenNthCalledWith(
      2,
      `units/${unitIdMock}/products/manage`,
      { target: 'position', size: 100, page: 2 }
    )
    expect(result.data).toEqual([menuItemMock, secondItem])
  })

  it('listProducts: sends pagination, filters and ordering to the API', async () => {
    // Arrange
    vi.mocked(api.getAll).mockResolvedValue(menuPageMock)

    // Act
    const result = await ProductService.listProducts(unitIdMock, {
      page: 1,
      size: 20,
      categoryId: 'category-1',
      search: 'coxinha',
      sortBy: 'category',
      direction: 'desc',
      packageEligible: true,
    })

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(
      `units/${unitIdMock}/products/manage`,
      {
        target: 'position',
        page: 1,
        size: 20,
        categoryId: 'category-1',
        search: 'coxinha',
        sortBy: 'category',
        direction: 'desc',
        packageEligible: 'true',
      }
    )
    expect(result).toBe(menuPageMock)
  })

  it('createItem: posts the new menu item', async () => {
    // Arrange
    vi.mocked(api.create).mockResolvedValue(menuItemMock)

    // Act
    const result = await ProductService.createItem(
      unitIdMock,
      createMenuItemRequestMock
    )

    // Assert
    expect(api.create).toHaveBeenCalledWith(
      `units/${unitIdMock}/products`,
      createMenuItemRequestMock
    )
    expect(result).toBe(menuItemMock)
  })

  it('createItemWithImage: creates item and uploads image', async () => {
    // Arrange
    vi.mocked(api.create).mockResolvedValue(menuItemMock)
    vi.mocked(api.createFormData).mockResolvedValue(menuItemImageMock)
    const image = new File(['bytes'], 'coxinha.png')

    // Act
    const result = await ProductService.createItemWithImage(
      unitIdMock,
      createMenuItemRequestMock,
      image
    )

    // Assert
    expect(api.createFormData).toHaveBeenCalledWith(
      `units/${unitIdMock}/products/${menuItemMock.id}/images`,
      expect.any(FormData)
    )
    expect(result).toEqual({ item: menuItemMock, imageUploadFailed: false })
  })

  it('createItemWithImage: flags the failure without image', async () => {
    // Arrange
    vi.mocked(api.create).mockResolvedValue(menuItemMock)

    // Act
    const result = await ProductService.createItemWithImage(
      unitIdMock,
      createMenuItemRequestMock,
      null
    )

    // Assert
    expect(api.createFormData).not.toHaveBeenCalled()
    expect(result).toEqual({ item: menuItemMock, imageUploadFailed: false })
  })

  it('createItemWithImage: flags imageUploadFailed on error', async () => {
    // Arrange
    vi.mocked(api.create).mockResolvedValue(menuItemMock)
    vi.mocked(api.createFormData).mockRejectedValue(new Error('offline'))
    const image = new File(['bytes'], 'coxinha.png')

    // Act
    const result = await ProductService.createItemWithImage(
      unitIdMock,
      createMenuItemRequestMock,
      image
    )

    // Assert
    expect(result).toEqual({ item: menuItemMock, imageUploadFailed: true })
  })

  it('setItemAvailability: patches the item active flag', async () => {
    // Act
    await ProductService.setItemAvailability(unitIdMock, productIdMock, false)

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `units/${unitIdMock}/products/${productIdMock}`,
      { isActive: false }
    )
  })

  it('setItemPosition: patches the item position', async () => {
    // Act
    await ProductService.setItemPosition(unitIdMock, productIdMock, 3)

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `units/${unitIdMock}/products/${productIdMock}`,
      { position: 3 }
    )
  })

  it('reorderItems: patches the new product order', async () => {
    // Act
    await ProductService.reorderItems(unitIdMock, reorderIdsMock)

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `units/${unitIdMock}/products/reorder`,
      { ids: reorderIdsMock }
    )
  })

  it('updateItem: patches the item by id', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(menuItemMock)

    // Act
    const result = await ProductService.updateItem(
      unitIdMock,
      productIdMock,
      updateMenuItemRequestMock
    )

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `units/${unitIdMock}/products/${productIdMock}`,
      updateMenuItemRequestMock
    )
    expect(result).toBe(menuItemMock)
  })

  it('replaceItemModifiers: patches every configured choice', async () => {
    vi.mocked(api.patch).mockResolvedValue(menuItemMock)

    const result = await ProductService.replaceItemModifiers(
      unitIdMock,
      productIdMock,
      replaceProductModifiersRequestMock
    )

    expect(api.patch).toHaveBeenCalledWith(
      `units/${unitIdMock}/products/${productIdMock}/modifiers`,
      { modifiers: replaceProductModifiersRequestMock }
    )
    expect(result).toBe(menuItemMock)
  })

  it('uploadItemImage: posts the file as form data', async () => {
    // Arrange
    vi.mocked(api.createFormData).mockResolvedValue(menuItemImageMock)
    const file = new File(['bytes'], 'coxinha.png')

    // Act
    const result = await ProductService.uploadItemImage(
      unitIdMock,
      productIdMock,
      file
    )

    // Assert
    expect(api.createFormData).toHaveBeenCalledWith(
      `units/${unitIdMock}/products/${productIdMock}/images`,
      expect.any(FormData)
    )
    expect(result).toBe(menuItemImageMock)
  })

  it('removeItem: deletes the item by id', async () => {
    // Arrange
    vi.mocked(api.remove).mockResolvedValue(removeMessageMock)

    // Act
    const result = await ProductService.removeItem(unitIdMock, productIdMock)

    // Assert
    expect(api.remove).toHaveBeenCalledWith(
      `units/${unitIdMock}/products/${productIdMock}`
    )
    expect(result).toBe(removeMessageMock)
  })

  it('removeItems: deletes several items by id in bulk', async () => {
    // Arrange
    vi.mocked(api.remove).mockResolvedValue(removeManyMessageMock)

    // Act
    const result = await ProductService.removeItems(unitIdMock, reorderIdsMock)

    // Assert
    expect(api.remove).toHaveBeenCalledWith(
      `units/${unitIdMock}/products/bulk`,
      { ids: reorderIdsMock }
    )
    expect(result).toBe(removeManyMessageMock)
  })

  it('removeItemImage: deletes a product image by id', async () => {
    // Arrange
    vi.mocked(api.remove).mockResolvedValue(removeMessageMock)

    // Act
    const result = await ProductService.removeItemImage(
      unitIdMock,
      productIdMock,
      'image-1'
    )

    // Assert
    expect(api.remove).toHaveBeenCalledWith(
      `units/${unitIdMock}/products/${productIdMock}/images/image-1`
    )
    expect(result).toBe(removeMessageMock)
  })
})
