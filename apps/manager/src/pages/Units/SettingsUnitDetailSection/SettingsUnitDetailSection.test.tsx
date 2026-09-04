import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SettingsUnitDetailSection } from './SettingsUnitDetailSection'
vi.mock(
  '../facades/useSettingsUnitDetailFacade/useSettingsUnitDetailFacade',
  () => ({
    useSettingsUnitDetailFacade: () => ({
      tenant: { tenantName: 'Loja principal' },
      location: { states: {}, municipalities: {} },
      units: {
        detail: { data: undefined, isPending: false },
        save: { mutate: vi.fn(), isPending: false },
        setMain: { mutate: vi.fn(), isPending: false },
      },
    }),
  })
)
vi.mock('@shared/components/Breadcrumb/Breadcrumb', () => ({
  Breadcrumb: () => <div>breadcrumb</div>,
}))
vi.mock('./UnitCard/UnitCard', () => ({
  UnitCard: () => <div>unit detail</div>,
}))
describe(SettingsUnitDetailSection.name, () => {
  it('renders unit detail settings', () => {
    render(<SettingsUnitDetailSection />)
    expect(screen.getByText('unit detail')).toBeInTheDocument()
  })
})
