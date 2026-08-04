import { describe, expect, it, vi } from 'vitest'

import { apiMock } from './http.service.mock'

vi.mock('@services/http.service', () => ({ api: apiMock }))

const { CategoryService } = await import('@services/category.service')

describe('CategoryService', () => {
  it('listCategories: reads GET tenants/:id/product-categories', async () => {
    // Arrange
    apiMock.get.mockResolvedValueOnce({ data: [] })

    // Act
    const result = await CategoryService.listCategories('tenant-1')

    // Assert
    expect(apiMock.get).toHaveBeenCalledWith(
      'tenants/tenant-1/product-categories'
    )
    expect(result).toEqual({ data: [] })
  })

  it('createCategory: creates a category with the given name', async () => {
    // Arrange
    apiMock.create.mockResolvedValueOnce({ id: 'cat-1', name: 'Lanches' })

    // Act
    const result = await CategoryService.createCategory(
      'tenant-1',
      'Lanches'
    )

    // Assert
    expect(apiMock.create).toHaveBeenCalledWith(
      'tenants/tenant-1/product-categories',
      { name: 'Lanches' }
    )
    expect(result).toEqual({ id: 'cat-1', name: 'Lanches' })
  })

  it('setCategoryPosition: patches the category position', async () => {
    // Arrange / Act
    await CategoryService.setCategoryPosition('tenant-1', 'cat-1', 3)

    // Assert
    expect(apiMock.patch).toHaveBeenCalledWith(
      'tenants/tenant-1/product-categories',
      'cat-1',
      { position: 3 }
    )
  })

  it('updateCategory: patches the category name', async () => {
    // Arrange / Act
    await CategoryService.updateCategory('tenant-1', 'cat-1', 'Bebidas')

    // Assert
    expect(apiMock.patch).toHaveBeenCalledWith(
      'tenants/tenant-1/product-categories',
      'cat-1',
      { name: 'Bebidas' }
    )
  })

  it('removeCategory: removes the category by id', async () => {
    // Arrange / Act
    await CategoryService.removeCategory('tenant-1', 'cat-1')

    // Assert
    expect(apiMock.remove).toHaveBeenCalledWith(
      'tenants/tenant-1/product-categories',
      'cat-1'
    )
  })

  it('propagates the error when the request fails', async () => {
    // Arrange
    apiMock.get.mockRejectedValueOnce(new Error('network error'))

    // Act / Assert
    await expect(
      CategoryService.listCategories('tenant-1')
    ).rejects.toThrow('network error')
  })
})
