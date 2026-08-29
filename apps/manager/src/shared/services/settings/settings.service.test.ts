import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { SettingsService } from './settings.service'
import {
  publicTenantSettingsMock,
  tenantIdMock,
  tenantSettingsMock,
  updateTenantSettingsRequestMock,
} from './settings.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: {
    get: vi.fn(),
    update: vi.fn(),
  },
}))

describe('SettingsService', () => {
  afterEach(() => vi.clearAllMocks())

  it('getSettings: reads the tenant settings', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(tenantSettingsMock)

    // Act
    const result = await SettingsService.getSettings(tenantIdMock)

    // Assert
    expect(api.get).toHaveBeenCalledWith(`tenants/${tenantIdMock}/settings`)
    expect(result).toBe(tenantSettingsMock)
  })

  it('getPublicSettings: reads the public store settings', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(publicTenantSettingsMock)

    // Act
    const result = await SettingsService.getPublicSettings(tenantIdMock)

    // Assert
    expect(api.get).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/settings/public`
    )
    expect(result).toBe(publicTenantSettingsMock)
  })

  it('saveSettings: updates the tenant settings', async () => {
    // Arrange
    vi.mocked(api.update).mockResolvedValue(tenantSettingsMock)

    // Act
    const result = await SettingsService.saveSettings(
      tenantIdMock,
      updateTenantSettingsRequestMock
    )

    // Assert
    expect(api.update).toHaveBeenCalledWith(
      `tenants/${tenantIdMock}/settings`,
      updateTenantSettingsRequestMock
    )
    expect(result).toBe(tenantSettingsMock)
  })
})
