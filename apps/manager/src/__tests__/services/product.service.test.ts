import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { apiMock } from './http.service.mock'

vi.mock('@services/http.service', () => ({ api: apiMock }))

const { ProductService } = await import('@services/product.service')

const page = (total: number, data: { id: string }[] = []) => ({
  data,
  pagination: { total },
})

describe('ProductService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('listMenu: returns the single page when everything fits in it', async () => {
    // Arrange
    apiMock.getAll.mockResolvedValueOnce(page(2, [{ id: 'p1' }, { id: 'p2' }]))

    // Act
    const result = await ProductService.listMenu('tenant-1')

    // Assert
    expect(apiMock.getAll).toHaveBeenCalledTimes(1)
    expect(apiMock.getAll).toHaveBeenCalledWith('tenants/tenant-1/products', {
      target: 'position',
      size: 100,
      page: 1,
    })
    expect(result).toEqual(page(2, [{ id: 'p1' }, { id: 'p2' }]))
  })

  it('listMenu: walks every page until the total is exhausted', async () => {
    // Arrange
    const first = page(150, [{ id: 'p1' }])
    const second = page(150, [{ id: 'p2' }])
    apiMock.getAll.mockResolvedValueOnce(first)
    apiMock.getAll.mockResolvedValueOnce(second)

    // Act
    const result = await ProductService.listMenu('tenant-1')

    // Assert
    expect(apiMock.getAll).toHaveBeenCalledTimes(2)
    expect(apiMock.getAll).toHaveBeenNthCalledWith(
      2,
      'tenants/tenant-1/products',
      { target: 'position', size: 100, page: 2 }
    )
    expect(result).toEqual({
      data: [{ id: 'p1' }, { id: 'p2' }],
      pagination: { total: 150 },
    })
  })

  it('listProducts: omits categoryId and search when not given', async () => {
    // Arrange / Act
    await ProductService.listProducts('tenant-1', { page: 1, size: 20 })

    // Assert
    expect(apiMock.getAll).toHaveBeenCalledWith('tenants/tenant-1/products', {
      target: 'position',
      page: 1,
      size: 20,
    })
  })

  it('listProducts: includes categoryId and search when given', async () => {
    // Arrange / Act
    await ProductService.listProducts('tenant-1', {
      page: 1,
      size: 20,
      categoryId: 'cat-1',
      search: 'burger',
    })

    // Assert
    expect(apiMock.getAll).toHaveBeenCalledWith('tenants/tenant-1/products', {
      target: 'position',
      page: 1,
      size: 20,
      categoryId: 'cat-1',
      search: 'burger',
    })
  })

  it('createItem: creates a menu item under the tenant', async () => {
    // Arrange
    const data = { name: 'X-Burger', price: 2500, categoryId: 'cat-1' }
    apiMock.create.mockResolvedValueOnce({ id: 'item-1', ...data })

    // Act
    const result = await ProductService.createItem('tenant-1', data)

    // Assert
    expect(apiMock.create).toHaveBeenCalledWith(
      'tenants/tenant-1/products',
      data
    )
    expect(result).toEqual({ id: 'item-1', ...data })
  })

  it('setItemAvailability: patches the isActive flag by id', async () => {
    // Arrange / Act
    await ProductService.setItemAvailability('tenant-1', 'item-1', false)

    // Assert
    expect(apiMock.patch).toHaveBeenCalledWith(
      'tenants/tenant-1/products/item-1',
      { isActive: false }
    )
  })

  it('setItemPosition: patches the item with the new position', async () => {
    // Arrange
    apiMock.patch.mockResolvedValueOnce({ id: 'item-1', position: 3 })

    // Act
    const result = await ProductService.setItemPosition(
      'tenant-1',
      'item-1',
      3
    )

    // Assert
    expect(apiMock.patch).toHaveBeenCalledWith(
      'tenants/tenant-1/products/item-1',
      { position: 3 }
    )
    expect(result).toEqual({ id: 'item-1', position: 3 })
  })

  it('updateItem: patches the item with the given fields', async () => {
    // Arrange
    const data = {
      name: 'X-Salada',
      price: 2500,
      categoryId: 'cat-1',
      position: 1,
      isActive: true,
    }

    // Act
    await ProductService.updateItem('tenant-1', 'item-1', data)

    // Assert
    expect(apiMock.patch).toHaveBeenCalledWith(
      'tenants/tenant-1/products/item-1',
      data
    )
  })

  it('uploadItemImage: posts the file as multipart form data', async () => {
    // Arrange
    const response = { id: 'image-1', url: 'https://cdn/image-1.png' }
    apiMock.createFormData.mockResolvedValueOnce(response)
    const file = new File(['conteudo'], 'foto.png', { type: 'image/png' })

    // Act
    const result = await ProductService.uploadItemImage(
      'tenant-1',
      'item-1',
      file
    )

    // Assert
    const [url, body] = apiMock.createFormData.mock.calls[0]
    expect(url).toBe('tenants/tenant-1/products/item-1/images')
    expect(body.get('file')).toBe(file)
    expect(result).toEqual(response)
  })

  it('uploadItemImage: propagates the shared client error', async () => {
    // Arrange
    apiMock.createFormData.mockRejectedValueOnce(
      new Error('Arquivo muito grande')
    )
    const file = new File(['conteudo'], 'foto.png', { type: 'image/png' })

    // Act / Assert
    await expect(
      ProductService.uploadItemImage('tenant-1', 'item-1', file)
    ).rejects.toThrow('Arquivo muito grande')
  })

  it('removeItem: removes the item by id', async () => {
    // Arrange / Act
    await ProductService.removeItem('tenant-1', 'item-1')

    // Assert
    expect(apiMock.remove).toHaveBeenCalledWith(
      'tenants/tenant-1/products/item-1'
    )
  })

  it('removeItemImage: removes the image by id under the product', async () => {
    // Arrange / Act
    await ProductService.removeItemImage('tenant-1', 'item-1', 'image-1')

    // Assert
    expect(apiMock.remove).toHaveBeenCalledWith(
      'tenants/tenant-1/products/item-1/images/image-1'
    )
  })

  it('propagates the error when the request fails', async () => {
    // Arrange
    apiMock.getAll.mockRejectedValueOnce(new Error('network error'))

    // Act / Assert
    await expect(ProductService.listMenu('tenant-1')).rejects.toThrow(
      'network error'
    )
  })
})
