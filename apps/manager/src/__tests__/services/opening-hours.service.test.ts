import { describe, expect, it, vi } from 'vitest'

import { apiMock } from './http.service.mock'

vi.mock('@services/http.service', () => ({ api: apiMock }))

const { OpeningHoursService } = await import(
  '@services/opening-hours.service'
)

describe('OpeningHoursService', () => {
  it('listOpeningHours: reads GET tenants/:id/opening-hours', async () => {
    // Arrange
    apiMock.get.mockResolvedValueOnce({ data: [], pagination: { total: 0 } })

    // Act
    const result = await OpeningHoursService.listOpeningHours('tenant-1')

    // Assert
    expect(apiMock.get).toHaveBeenCalledWith(
      'tenants/tenant-1/opening-hours'
    )
    expect(result).toEqual({ data: [], pagination: { total: 0 } })
  })

  it('createOpeningHours: sends isOpen so a day created as closed stays closed', async () => {
    // O default de `is_open` no banco é `true`: omitir o campo faz um dia
    // criado como fechado voltar aberto da API, apagando a escolha em silêncio.
    // Arrange / Act
    await OpeningHoursService.createOpeningHours('tenant-1', {
      dayOfWeek: 3,
      openTime: '18:00',
      closeTime: '23:00',
      isOpen: false,
    })

    // Assert
    expect(apiMock.create).toHaveBeenCalledWith(
      'tenants/tenant-1/opening-hours',
      { dayOfWeek: 3, openTime: '18:00', closeTime: '23:00', isOpen: false }
    )
  })

  it('updateOpeningHours: patches only the given fields by id', async () => {
    // Arrange / Act
    await OpeningHoursService.updateOpeningHours('tenant-1', 'hour-1', {
      isOpen: false,
    })

    // Assert
    expect(apiMock.patch).toHaveBeenCalledWith(
      'tenants/tenant-1/opening-hours',
      'hour-1',
      { isOpen: false }
    )
  })

  it('removeOpeningHours: removes the entry by id', async () => {
    // Arrange / Act
    await OpeningHoursService.removeOpeningHours('tenant-1', 'hour-1')

    // Assert
    expect(apiMock.remove).toHaveBeenCalledWith(
      'tenants/tenant-1/opening-hours',
      'hour-1'
    )
  })

  it('propagates the error when the request fails', async () => {
    // Arrange
    apiMock.get.mockRejectedValueOnce(new Error('network error'))

    // Act / Assert
    await expect(
      OpeningHoursService.listOpeningHours('tenant-1')
    ).rejects.toThrow('network error')
  })
})
