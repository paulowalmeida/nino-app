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
  Breadcrumb: ({ trail }: { trail: { label: string; to?: string }[] }) => (
    <nav>
      {trail.map(({ label, to }) => (
        <span key={label} data-to={to}>
          {label}
        </span>
      ))}
    </nav>
  ),
}))
vi.mock('@pages/Units/UnitInfo/UnitInfo', () => ({
  UnitInfo: () => <div>unit information</div>,
}))

describe(SettingsUnitDetailSection.name, () => {
  it('frames the unit with its trail and information', () => {
    render(<SettingsUnitDetailSection />)

    expect(screen.getByText('unit information')).toBeInTheDocument()
  })

  it('sends the unit list crumb to the list, not back to itself', () => {
    render(<SettingsUnitDetailSection />)

    expect(screen.getByText('Unidades')).toHaveAttribute(
      'data-to',
      '../unidades'
    )
  })

  it('still frames the screen before the unit is known', () => {
    tenant = null

    render(<SettingsUnitDetailSection />)

    expect(screen.getByText('unit information')).toBeInTheDocument()

    tenant = settingsUnitDetailSectionMock.tenant
  })
})
