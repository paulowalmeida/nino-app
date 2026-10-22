import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { DeliveryZoneService } from './delivery-zone.service'
import {
  createDeliveryZoneRequestMock,
  deliveryZoneMock,
  deliveryZonePageMock,
  removeDeliveryZoneMessageMock,
  unitIdMock,
  updateDeliveryZoneRequestMock,
  zoneIdMock,
} from './delivery-zone.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: {
    get: vi.fn(),
    create: vi.fn(),
    patch: vi.fn(),
    remove: vi.fn(),
  },
}))

describe('DeliveryZoneService', () => {
  afterEach(() => vi.clearAllMocks())

  it('listDeliveryZones: reads the unit delivery zones', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(deliveryZonePageMock)

    // Act
    const result = await DeliveryZoneService.listDeliveryZones(unitIdMock)

    // Assert
    expect(api.get).toHaveBeenCalledWith(`units/${unitIdMock}/delivery-zones`)
    expect(result).toBe(deliveryZonePageMock)
  })

  it('createDeliveryZone: posts a new zone with name and fee', async () => {
    // Arrange
    vi.mocked(api.create).mockResolvedValue(deliveryZoneMock)

    // Act
    const result = await DeliveryZoneService.createDeliveryZone(
      unitIdMock,
      createDeliveryZoneRequestMock
    )

    // Assert
    expect(api.create).toHaveBeenCalledWith(
      `units/${unitIdMock}/delivery-zones`,
      createDeliveryZoneRequestMock
    )
    expect(result).toBe(deliveryZoneMock)
  })

  it('updateDeliveryZone: patches the zone by id', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(deliveryZoneMock)

    // Act
    const result = await DeliveryZoneService.updateDeliveryZone(
      unitIdMock,
      zoneIdMock,
      updateDeliveryZoneRequestMock
    )

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `units/${unitIdMock}/delivery-zones/${zoneIdMock}`,
      updateDeliveryZoneRequestMock
    )
    expect(result).toBe(deliveryZoneMock)
  })

  it('removeDeliveryZone: deletes the zone by id', async () => {
    // Arrange
    vi.mocked(api.remove).mockResolvedValue(removeDeliveryZoneMessageMock)

    // Act
    const result = await DeliveryZoneService.removeDeliveryZone(
      unitIdMock,
      zoneIdMock
    )

    // Assert
    expect(api.remove).toHaveBeenCalledWith(
      `units/${unitIdMock}/delivery-zones/${zoneIdMock}`
    )
    expect(result).toBe(removeDeliveryZoneMessageMock)
  })
})
