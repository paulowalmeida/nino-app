import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SettingsUnitDetailSection } from './SettingsUnitDetailSection'
import { settingsUnitDetailSectionMock } from './SettingsUnitDetailSection.mock'

vi.mock('@pages/Units/UnitInfo/UnitInfo', () => ({
  UnitInfo: () => <div>{settingsUnitDetailSectionMock.unitInfoText}</div>,
}))

describe(SettingsUnitDetailSection.name, () => {
  it('frames the unit information panel', () => {
    // Arrange & Act
    render(<SettingsUnitDetailSection />)

    // Assert
    expect(
      screen.getByText(settingsUnitDetailSectionMock.unitInfoText)
    ).toBeInTheDocument()
  })
})
