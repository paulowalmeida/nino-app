import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { SettingsService } from './settings.service'
import {
  publicUnitSettingsMock,
  unitIdMock,
  unitSettingsMock,
  updateUnitSettingsRequestMock,
} from './settings.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: {
    get: vi.fn(),
    update: vi.fn(),
  },
}))

describe('SettingsService', () => {
  afterEach(() => vi.clearAllMocks())

  it('getSettings: reads the unit settings', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(unitSettingsMock)

    // Act
    const result = await SettingsService.getSettings(unitIdMock)

    // Assert
    expect(api.get).toHaveBeenCalledWith(`units/${unitIdMock}/settings`)
    expect(result).toBe(unitSettingsMock)
  })

  it('getPublicSettings: reads the public store settings', async () => {
    // Arrange
    vi.mocked(api.get).mockResolvedValue(publicUnitSettingsMock)

    // Act
    const result = await SettingsService.getPublicSettings(unitIdMock)

    // Assert
    expect(api.get).toHaveBeenCalledWith(
      `units/${unitIdMock}/settings/public`
    )
    expect(result).toBe(publicUnitSettingsMock)
  })

  it('saveSettings: updates the unit settings', async () => {
    // Arrange
    vi.mocked(api.update).mockResolvedValue(unitSettingsMock)

    // Act
    const result = await SettingsService.saveSettings(
      unitIdMock,
      updateUnitSettingsRequestMock
    )

    // Assert
    expect(api.update).toHaveBeenCalledWith(
      `units/${unitIdMock}/settings`,
      updateUnitSettingsRequestMock
    )
    expect(result).toBe(unitSettingsMock)
  })
})
