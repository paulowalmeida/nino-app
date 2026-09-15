import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { ConsumerService } from './consumer.service'
import {
  consumerHistoryMock,
  consumerHistoryPageMock,
  consumerIdMock,
  consumerPageMock,
  topConsumerMetricMock,
  topConsumersMock,
  unitIdMock,
} from './consumer.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: {
    get: vi.fn(),
    getAll: vi.fn(),
  },
}))

describe('ConsumerService', () => {
  afterEach(() => vi.clearAllMocks())

  it('listConsumers: paginates unit consumers by recency', async () => {
    // Arrange
    vi.mocked(api.getAll).mockResolvedValue(consumerPageMock)

    // Act
    const result = await ConsumerService.listConsumers(unitIdMock, 1)

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(
      `units/${unitIdMock}/consumers`,
      { target: 'createdAt', direction: 'desc', size: 30, page: 1 }
    )
    expect(result).toBe(consumerPageMock)
  })

  it('listConsumers: includes the search term when given', async () => {
    // Act
    await ConsumerService.listConsumers(unitIdMock, 1, 'ana')

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(
      `units/${unitIdMock}/consumers`,
      {
        target: 'createdAt',
        direction: 'desc',
        size: 30,
        page: 1,
        search: 'ana',
      }
    )
  })

  it('listConsumerOrders: paginates a consumer order history', async () => {
    // Arrange
    vi.mocked(api.getAll).mockResolvedValue(consumerHistoryPageMock)

    // Act
    const result = await ConsumerService.listConsumerOrders(
      unitIdMock,
      consumerIdMock,
      1
    )

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(
      `units/${unitIdMock}/consumers/${consumerIdMock}/orders`,
      { target: 'createdAt', direction: 'desc', size: 15, page: 1 }
    )
    expect(result).toBe(consumerHistoryPageMock)
  })

  it('getById: reads a single consumer by id', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(consumerHistoryMock)

    // Act
    const result = await ConsumerService.getById(
      unitIdMock,
      consumerIdMock
    )

    // Assert
    expect(api.get).toHaveBeenCalledWith(
      `units/${unitIdMock}/consumers/${consumerIdMock}`
    )
    expect(result).toBe(consumerHistoryMock)
  })

  it('getTopConsumers: reads the ranked consumers by metric', async () => {
    // Arrange
    vi.mocked(api.getAll).mockResolvedValue(topConsumersMock)

    // Act
    const result = await ConsumerService.getTopConsumers(
      unitIdMock,
      topConsumerMetricMock,
      5
    )

    // Assert
    expect(api.getAll).toHaveBeenCalledWith(
      `units/${unitIdMock}/consumers/top`,
      { metric: topConsumerMetricMock, limit: 5 }
    )
    expect(result).toBe(topConsumersMock)
  })
})
