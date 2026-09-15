import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { UnitService } from './unit.service'
import {
  createdStoreMock,
  createStoreRequestMock,
  pauseRequestMock,
  removeUnitMessageMock,
  storeTypeOptionsMock,
  unitDetailMock,
  unitIdMock,
  unitPauseMock,
  updateUnitRequestMock,
} from './unit.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: {
    get: vi.fn(),
    create: vi.fn(),
    patch: vi.fn(),
    remove: vi.fn(),
  },
}))

describe('UnitService', () => {
  afterEach(() => vi.clearAllMocks())

  it('createStore: posts a new store for the company', async () => {
    // Arrange
    vi.mocked(api.create).mockResolvedValue(createdStoreMock)

    // Act
    const result = await UnitService.createStore(createStoreRequestMock)

    // Assert
    expect(api.create).toHaveBeenCalledWith(
      'my/company/units',
      createStoreRequestMock
    )
    expect(result).toBe(createdStoreMock)
  })

  it('listStoreTypes: reads the available store types', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(storeTypeOptionsMock)

    // Act
    const result = await UnitService.listStoreTypes()

    // Assert
    expect(api.get).toHaveBeenCalledWith('my/company/units/types')
    expect(result).toBe(storeTypeOptionsMock)
  })

  it('getById: reads a unit by id', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(unitDetailMock)

    // Act
    const result = await UnitService.getById(unitIdMock)

    // Assert
    expect(api.get).toHaveBeenCalledWith(`units/${unitIdMock}`)
    expect(result).toBe(unitDetailMock)
  })

  it('updateUnit: patches the unit by id', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(unitDetailMock)

    // Act
    const result = await UnitService.updateUnit(
      unitIdMock,
      updateUnitRequestMock
    )

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `units/${unitIdMock}`,
      updateUnitRequestMock
    )
    expect(result).toBe(unitDetailMock)
  })

  it('getPause: reads the unit pause status', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(unitPauseMock)

    // Act
    const result = await UnitService.getPause(unitIdMock)

    // Assert
    expect(api.get).toHaveBeenCalledWith(`units/${unitIdMock}/pause`)
    expect(result).toBe(unitPauseMock)
  })

  it('pauseStore: patches the unit pause with a reason', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(unitPauseMock)

    // Act
    const result = await UnitService.pauseStore(
      unitIdMock,
      pauseRequestMock
    )

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `units/${unitIdMock}/pause`,
      pauseRequestMock
    )
    expect(result).toBe(unitPauseMock)
  })

  it('resumeStore: patches the unit back to active', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(unitPauseMock)

    // Act
    const result = await UnitService.resumeStore(unitIdMock)

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `units/${unitIdMock}/resume`,
      {}
    )
    expect(result).toBe(unitPauseMock)
  })

  it('removeUnit: deletes the unit by id', async () => {
    // Arrange
    vi.mocked(api.remove).mockResolvedValue(removeUnitMessageMock)

    // Act
    const result = await UnitService.removeUnit(unitIdMock)

    // Assert
    expect(api.remove).toHaveBeenCalledWith(`units/${unitIdMock}`)
    expect(result).toBe(removeUnitMessageMock)
  })

  it('setMainUnit: patches the unit as the main store', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(unitDetailMock)

    // Act
    const result = await UnitService.setMainUnit(unitIdMock)

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `units/${unitIdMock}/main`,
      {}
    )
    expect(result).toBe(unitDetailMock)
  })
})
