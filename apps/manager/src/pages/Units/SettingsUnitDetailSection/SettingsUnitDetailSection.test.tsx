import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SettingsUnitDetailSection } from './SettingsUnitDetailSection'
import { settingsUnitDetailSectionMock } from './SettingsUnitDetailSection.mock'

let tenant: { tenantName: string } | null = settingsUnitDetailSectionMock.tenant

vi.mock(
  '@pages/Units/facades/useUnitDetailShellFacade/useUnitDetailShellFacade',
  () => ({
    useUnitDetailShellFacade: () => ({ tenant }),
  })
)
vi.mock('@shared/components/Breadcrumb/Breadcrumb', () => ({
  Breadcrumb: () => <div>breadcrumb</div>,
}))
vi.mock('./UnitDetailTabs/UnitDetailTabs', () => ({
  UnitDetailTabs: () => <div>unit tabs</div>,
}))

describe(SettingsUnitDetailSection.name, () => {
  it('frames the unit with its trail and tabs', () => {
    render(<SettingsUnitDetailSection />)

    expect(screen.getByText('breadcrumb')).toBeInTheDocument()
    expect(screen.getByText('unit tabs')).toBeInTheDocument()
  })

  it('still frames the screen before the unit is known', () => {
    tenant = null

    render(<SettingsUnitDetailSection />)

    expect(screen.getByText('unit tabs')).toBeInTheDocument()

    tenant = settingsUnitDetailSectionMock.tenant
  })
})
