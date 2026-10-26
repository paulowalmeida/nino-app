import { describe, expect, it } from 'vitest'

import { unitDetailMock } from '@pages/Units/hooks/useUnitTheme/useUnitTheme.mock'
import { draftThemeMock } from '@pages/Units/services/unit-theme.service/unit-theme.service.mock'

import { toUnitThemeDraft } from './toUnitThemeDraft'

describe(toUnitThemeDraft.name, () => {
  it('loads the saved theme values and assets into the editor draft', () => {
    const draft = toUnitThemeDraft(unitDetailMock, draftThemeMock)

    expect(draft).toMatchObject({
      logoUrl: draftThemeMock.config.brand.logoUrl,
      bannerUrl: draftThemeMock.config.brand.bannerUrl,
      primaryColor: draftThemeMock.config.colors.primary,
      loadingType: draftThemeMock.config.loading.type,
    })
  })
})
