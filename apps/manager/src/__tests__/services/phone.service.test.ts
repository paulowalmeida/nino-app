import { describe, expect, it, vi } from 'vitest'

import { apiMock } from './http.service.mock'

vi.mock('@services/http.service', () => ({ api: apiMock }))

const { PhoneService } = await import('@services/phone.service')

describe('PhoneService', () => {
  it('listPhones: reads GET tenants/:id/phones', async () => {
    // Arrange
    apiMock.get.mockResolvedValueOnce({ data: [], pagination: { total: 0 } })

    // Act
    const result = await PhoneService.listPhones('tenant-1')

    // Assert
    expect(apiMock.get).toHaveBeenCalledWith('tenants/tenant-1/phones')
    expect(result).toEqual({ data: [], pagination: { total: 0 } })
  })

  it('createPhone: creates a phone with the given number', async () => {
    // Arrange
    apiMock.create.mockResolvedValueOnce({
      id: 'phone-1',
      phone: '11987654321',
    })

    // Act
    const result = await PhoneService.createPhone(
      'tenant-1',
      '11987654321'
    )

    // Assert
    expect(apiMock.create).toHaveBeenCalledWith('tenants/tenant-1/phones', {
      phone: '11987654321',
    })
    expect(result).toEqual({ id: 'phone-1', phone: '11987654321' })
  })

  it('updatePhone: patches the phone number by id', async () => {
    // Arrange / Act
    await PhoneService.updatePhone('tenant-1', 'phone-1', '11912345678')

    // Assert
    expect(apiMock.patch).toHaveBeenCalledWith(
      'tenants/tenant-1/phones',
      'phone-1',
      { phone: '11912345678' }
    )
  })

  it('removePhone: removes the phone by id', async () => {
    // Arrange / Act
    await PhoneService.removePhone('tenant-1', 'phone-1')

    // Assert
    expect(apiMock.remove).toHaveBeenCalledWith(
      'tenants/tenant-1/phones',
      'phone-1'
    )
  })

  it('propagates the error when the request fails', async () => {
    // Arrange
    apiMock.get.mockRejectedValueOnce(new Error('network error'))

    // Act / Assert
    await expect(PhoneService.listPhones('tenant-1')).rejects.toThrow(
      'network error'
    )
  })
})
