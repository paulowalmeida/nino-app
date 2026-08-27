import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { CustomerService } from './customer.service'
import {
  customerHistoryMock,
  customerHistoryPageMock,
  customerIdMock,
  customerPageMock,
  tenantIdMock,
  topCustomerMetricMock,
  topCustomersMock,
} from './customer.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: {
    get: vi.fn(),
    getAll: vi.fn(),
  },
}))

describe('CustomerService', () => {
  afterEach(() => vi.clearAllMocks())

  it('listCustomers: paginates tenant customers by recency', async () => {
    // Arrange
    vi.mocked(api.getAll).mockResolvedValue(customerPageMock)

    // Act
    const result = await CustomerService.listCustomers(tenantIdMock, 1)

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/customers`,
      { target: 'createdAt', direction: 'desc', size: 30, page: 1 }
    )
    expect(result).toBe(customerPageMock)
  })

  it('listCustomers: includes the search term when given', async () => {
    // Act
    await CustomerService.listCustomers(tenantIdMock, 1, 'ana')

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/customers`,
      {
        target: 'createdAt',
        direction: 'desc',
        size: 30,
        page: 1,
        search: 'ana',
      }
    )
  })

  it('listCustomerOrders: paginates a customer order history', async () => {
    // Arrange
    vi.mocked(api.getAll).mockResolvedValue(customerHistoryPageMock)

    // Act
    const result = await CustomerService.listCustomerOrders(
      tenantIdMock,
      customerIdMock,
      1
    )

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/customers/${customerIdMock}/orders`,
      { target: 'createdAt', direction: 'desc', size: 15, page: 1 }
    )
    expect(result).toBe(customerHistoryPageMock)
  })

  it('getById: reads a single customer by id', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(customerHistoryMock)

    // Act
    const result = await CustomerService.getById(
      tenantIdMock,
      customerIdMock
    )

    // Assert
    expect(api.get).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/customers/${customerIdMock}`
    )
    expect(result).toBe(customerHistoryMock)
  })

  it('getTopCustomers: reads the ranked customers by metric', async () => {
    // Arrange
    vi.mocked(api.getAll).mockResolvedValue(topCustomersMock)

    // Act
    const result = await CustomerService.getTopCustomers(
      tenantIdMock,
      topCustomerMetricMock,
      5
    )

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/customers/top`,
      { metric: topCustomerMetricMock, limit: 5 }
    )
    expect(result).toBe(topCustomersMock)
  })
})
