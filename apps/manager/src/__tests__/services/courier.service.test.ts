import { describe, expect, it, vi } from 'vitest'

import { apiMock } from './http.service.mock'

vi.mock('@services/http.service', () => ({ api: apiMock }))

const { CourierService } = await import('@services/courier.service')

describe('CourierService', () => {
  it('listCouriers: reads GET tenants/:id/couriers', async () => {
    // Arrange
    apiMock.get.mockResolvedValueOnce({ data: [], pagination: { total: 0 } })

    // Act
    const result = await CourierService.listCouriers('tenant-1')

    // Assert
    expect(apiMock.get).toHaveBeenCalledWith('tenants/tenant-1/couriers')
    expect(result).toEqual({ data: [], pagination: { total: 0 } })
  })

  it('removeCourier: removes the courier by id under the tenant', async () => {
    // Arrange / Act
    await CourierService.removeCourier('tenant-1', 'courier-1')

    // Assert
    expect(apiMock.remove).toHaveBeenCalledWith(
      'tenants/tenant-1/couriers/courier-1'
    )
  })

  it('propagates the error when the request fails', async () => {
    // Arrange
    apiMock.get.mockRejectedValueOnce(new Error('network error'))

    // Act / Assert
    await expect(CourierService.listCouriers('tenant-1')).rejects.toThrow(
      'network error'
    )
  })
})
