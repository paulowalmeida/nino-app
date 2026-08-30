import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SettingsPhysicalTab } from './SettingsPhysicalTab'
import { settingsPhysicalTabMock } from './SettingsPhysicalTab.mock'

describe(SettingsPhysicalTab.name, () => {
  it('presents the future physical ticket workflow', () => {
    render(<SettingsPhysicalTab />)

    expect(
      screen.getByRole('heading', { name: settingsPhysicalTabMock.heading })
    ).toBeInTheDocument()
    expect(screen.getByText(settingsPhysicalTabMock.status)).toBeInTheDocument()
  })
})
