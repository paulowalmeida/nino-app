import { describe, expect, it, vi } from 'vitest'

import { apiMock } from './http.service.mock'

vi.mock('@services/http.service', () => ({ api: apiMock }))

const { DeliveryZoneService } = await import(
  '@services/delivery-zone.service'
)

describe('DeliveryZoneService', () => {
  it('listDeliveryZones: reads GET tenants/:id/delivery-zones', async () => {
    // Arrange
    apiMock.get.mockResolvedValueOnce({ data: [], pagination: { total: 0 } })

    // Act
    const result = await DeliveryZoneService.listDeliveryZones('tenant-1')

    // Assert
    expect(apiMock.get).toHaveBeenCalledWith(
      'tenants/tenant-1/delivery-zones'
    )
    expect(result).toEqual({ data: [], pagination: { total: 0 } })
  })

  it('createDeliveryZone: creates a zone with name and fee', async () => {
    // Arrange
    const data = { name: 'Centro', fee: 8 }
    apiMock.create.mockResolvedValueOnce({ id: 'zone-1', ...data })

    // Act
    const result = await DeliveryZoneService.createDeliveryZone(
      'tenant-1',
      data
    )

    // Assert
    expect(apiMock.create).toHaveBeenCalledWith(
      'tenants/tenant-1/delivery-zones',
      data
    )
    expect(result).toEqual({ id: 'zone-1', ...data })
  })

  it('updateDeliveryZone: patches the zone with the given fields', async () => {
    // Arrange / Act
    await DeliveryZoneService.updateDeliveryZone('tenant-1', 'zone-1', {
      isActive: false,
    })

    // Assert
    expect(apiMock.patch).toHaveBeenCalledWith(
      'tenants/tenant-1/delivery-zones',
      'zone-1',
      { isActive: false }
    )
  })

  it('removeDeliveryZone: removes the zone by id', async () => {
    // Arrange / Act
    await DeliveryZoneService.removeDeliveryZone('tenant-1', 'zone-1')

    // Assert
    expect(apiMock.remove).toHaveBeenCalledWith(
      'tenants/tenant-1/delivery-zones',
      'zone-1'
    )
  })

  it('propagates the error when the request fails', async () => {
    // Arrange
    apiMock.get.mockRejectedValueOnce(new Error('network error'))

    // Act / Assert
    await expect(
      DeliveryZoneService.listDeliveryZones('tenant-1')
    ).rejects.toThrow('network error')
  })
})
