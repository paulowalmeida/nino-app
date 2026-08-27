import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { OpeningHoursService } from './opening-hours.service'
import {
  createOpeningHoursRequestMock,
  openingHoursIdMock,
  openingHoursMock,
  openingHoursPageMock,
  removeOpeningHoursMessageMock,
  tenantIdMock,
  updateOpeningHoursRequestMock,
} from './opening-hours.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: {
    get: vi.fn(),
    create: vi.fn(),
    patch: vi.fn(),
    remove: vi.fn(),
  },
}))

describe('OpeningHoursService', () => {
  afterEach(() => vi.clearAllMocks())

  it('listOpeningHours: reads the tenant opening hours', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(openingHoursPageMock)

    // Act
    const result = await OpeningHoursService.listOpeningHours(tenantIdMock)

    // Assert
    expect(api.get).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/opening-hours`
    )
    expect(result).toBe(openingHoursPageMock)
  })

  it('createOpeningHours: posts a new weekday schedule', async () => {
    // Arrange
    vi.mocked(api.create).mockResolvedValue(openingHoursMock)

    // Act
    const result = await OpeningHoursService.createOpeningHours(
      tenantIdMock,
      createOpeningHoursRequestMock
    )

    // Assert
    expect(api.create).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/opening-hours`,
      createOpeningHoursRequestMock
    )
    expect(result).toBe(openingHoursMock)
  })

  it('updateOpeningHours: patches the schedule by id', async () => {
    // Arrange
    vi.mocked(api.patch).mockResolvedValue(openingHoursMock)

    // Act
    const result = await OpeningHoursService.updateOpeningHours(
      tenantIdMock,
      openingHoursIdMock,
      updateOpeningHoursRequestMock
    )

    // Assert
    expect(api.patch).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/opening-hours/${openingHoursIdMock}`,
      updateOpeningHoursRequestMock
    )
    expect(result).toBe(openingHoursMock)
  })

  it('removeOpeningHours: deletes the schedule by id', async () => {
    // Arrange
    vi.mocked(api.remove).mockResolvedValue(removeOpeningHoursMessageMock)

    // Act
    const result = await OpeningHoursService.removeOpeningHours(
      tenantIdMock,
      openingHoursIdMock
    )

    // Assert
    expect(api.remove).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/opening-hours/${openingHoursIdMock}`
    )
    expect(result).toBe(removeOpeningHoursMessageMock)
  })
})
