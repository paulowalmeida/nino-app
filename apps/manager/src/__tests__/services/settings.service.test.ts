import { describe, expect, it, vi } from 'vitest'

import type { PaymentMethod } from '@custom_types/order/payment-method'
import { apiMock } from './http.service.mock'

vi.mock('@services/http.service', () => ({ api: apiMock }))

const { SettingsService } = await import('@services/settings.service')

describe('SettingsService', () => {
  it('getSettings: reads GET tenants/:id/settings', async () => {
    // Arrange
    apiMock.get.mockResolvedValueOnce({ id: 'settings-1' })

    // Act
    const result = await SettingsService.getSettings('tenant-1')

    // Assert
    expect(apiMock.get).toHaveBeenCalledWith('tenants/tenant-1/settings')
    expect(result).toEqual({ id: 'settings-1' })
  })

  it('getAcceptedPayments: reads the public settings endpoint', async () => {
    // Arrange
    apiMock.get.mockResolvedValueOnce({ acceptedPaymentMethods: ['PIX'] })

    // Act
    const result = await SettingsService.getAcceptedPayments('tenant-1')

    // Assert
    expect(apiMock.get).toHaveBeenCalledWith('tenants/tenant-1/settings/public')
    expect(result).toEqual({ acceptedPaymentMethods: ['PIX'] })
  })

  it('saveSettings: updates tenants/:id with settings as the id segment', async () => {
    // Arrange
    const data: { acceptedPaymentMethods: PaymentMethod[] } = {
      acceptedPaymentMethods: ['PIX_ONLINE', 'CASH'],
    }
    apiMock.update.mockResolvedValueOnce({ id: 'settings-1', ...data })

    // Act
    const result = await SettingsService.saveSettings('tenant-1', data)

    // Assert
    expect(apiMock.update).toHaveBeenCalledWith(
      'tenants/tenant-1/settings',
      data
    )
    expect(result).toEqual({ id: 'settings-1', ...data })
  })

  it('propagates the error when the request fails', async () => {
    // Arrange
    apiMock.get.mockRejectedValueOnce(new Error('network error'))

    // Act / Assert
    await expect(SettingsService.getSettings('tenant-1')).rejects.toThrow(
      'network error'
    )
  })
})
