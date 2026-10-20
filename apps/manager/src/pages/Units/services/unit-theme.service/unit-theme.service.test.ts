import { beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from '@shared/services/http/http.service'

import { UnitThemeService } from './unit-theme.service'
import {
  draftThemeMock,
  publishedThemeMock,
  themeEditorStateMock,
  themeServiceConfigMock,
  themeServiceUnitId,
} from './unit-theme.service.mock'

vi.mock('@shared/services/http/http.service', () => ({
  api: { get: vi.fn(), update: vi.fn(), create: vi.fn() },
}))

describe('UnitThemeService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('reads the editor state of one unit', async () => {
    vi.mocked(api.get).mockResolvedValue(themeEditorStateMock)

    await expect(
      UnitThemeService.getEditorState(themeServiceUnitId)
    ).resolves.toEqual(themeEditorStateMock)
    expect(api.get).toHaveBeenCalledWith('units/unit-1/theme')
  })

  it('sends the theme document to the draft endpoint', async () => {
    vi.mocked(api.update).mockResolvedValue(draftThemeMock)

    await UnitThemeService.saveDraft(themeServiceUnitId, themeServiceConfigMock)

    expect(api.update).toHaveBeenCalledWith(
      'units/unit-1/theme/draft',
      themeServiceConfigMock
    )
  })

  it('publishes with no body: the draft is already stored', async () => {
    vi.mocked(api.create).mockResolvedValue(publishedThemeMock)

    await expect(
      UnitThemeService.publishDraft(themeServiceUnitId)
    ).resolves.toEqual(publishedThemeMock)
    expect(api.create).toHaveBeenCalledWith(
      'units/unit-1/theme/publish',
      undefined
    )
  })

  it('addresses the restore endpoint by version number', async () => {
    vi.mocked(api.create).mockResolvedValue(publishedThemeMock)

    await UnitThemeService.restoreVersion(themeServiceUnitId, 2)

    expect(api.create).toHaveBeenCalledWith(
      'units/unit-1/theme/versions/2/restore',
      undefined
    )
  })

  it('lets a transport failure reach the caller', async () => {
    vi.mocked(api.create).mockRejectedValue(new Error('offline'))

    await expect(
      UnitThemeService.publishDraft(themeServiceUnitId)
    ).rejects.toThrow('offline')
  })
})
