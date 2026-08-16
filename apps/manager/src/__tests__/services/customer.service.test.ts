import { describe, expect, it, vi } from 'vitest'

import { apiMock } from './http.service.mock'

vi.mock('@services/http.service', () => ({ api: apiMock }))

const { CustomerService, CUSTOMER_PAGE_SIZE, HISTORY_PAGE_SIZE } =
  await import('@services/customer.service')

describe('CustomerService', () => {
  it('listCustomers: reads a page ordered by createdAt desc', async () => {
    // Arrange
    apiMock.getAll.mockResolvedValueOnce({
      data: [],
      pagination: { total: 0 },
    })

    // Act
    const result = await CustomerService.listCustomers('tenant-1', 2)

    // Assert
    expect(apiMock.getAll).toHaveBeenCalledWith('tenants/tenant-1/customers', {
      target: 'createdAt',
      direction: 'desc',
      size: CUSTOMER_PAGE_SIZE,
      page: 2,
    })
    expect(result).toEqual({ data: [], pagination: { total: 0 } })
  })

  it('listCustomers: sends the search term when there is one', async () => {
    // Arrange
    apiMock.getAll.mockResolvedValueOnce({
      data: [],
      pagination: { total: 0 },
    })

    // Act
    await CustomerService.listCustomers('tenant-1', 1, 'maria')

    // Assert
    expect(apiMock.getAll).toHaveBeenCalledWith('tenants/tenant-1/customers', {
      target: 'createdAt',
      direction: 'desc',
      size: CUSTOMER_PAGE_SIZE,
      page: 1,
      search: 'maria',
    })
  })

  it('listCustomerOrders: reads the order history of a customer', async () => {
    // Arrange
    apiMock.getAll.mockResolvedValueOnce({
      data: [],
      pagination: { total: 0 },
    })

    // Act
    const result = await CustomerService.listCustomerOrders(
      'tenant-1',
      'customer-1',
      1
    )

    // Assert
    expect(apiMock.getAll).toHaveBeenCalledWith(
      'tenants/tenant-1/customers/customer-1/orders',
      {
        target: 'createdAt',
        direction: 'desc',
        size: HISTORY_PAGE_SIZE,
        page: 1,
      }
    )
    expect(result).toEqual({ data: [], pagination: { total: 0 } })
  })

  it('getById: reads GET tenants/:id/customers/:id', async () => {
    // Arrange
    apiMock.get.mockResolvedValueOnce({ id: 'customer-1' })

    // Act
    const result = await CustomerService.getById('tenant-1', 'customer-1')

    // Assert
    expect(apiMock.get).toHaveBeenCalledWith(
      'tenants/tenant-1/customers/customer-1'
    )
    expect(result).toEqual({ id: 'customer-1' })
  })

  it('propagates the error when the request fails', async () => {
    // Arrange
    apiMock.get.mockRejectedValueOnce(new Error('network error'))

    // Act / Assert
    await expect(
      CustomerService.getById('tenant-1', 'customer-1')
    ).rejects.toThrow('network error')
  })
})
