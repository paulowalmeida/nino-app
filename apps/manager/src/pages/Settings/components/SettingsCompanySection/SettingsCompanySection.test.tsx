import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SettingsCompanySection } from './SettingsCompanySection'

vi.mock('../../facades/useSettingsFacade/useSettingsFacade', () => ({
  useSettingsFacade: () => ({
    company: {
      query: { data: undefined, isPending: false },
      save: { mutate: vi.fn(), isPending: false },
    },
  }),
}))
vi.mock('./CompanyCard/CompanyCard', () => ({
  CompanyCard: () => <div>company settings</div>,
}))

describe(SettingsCompanySection.name, () => {
  it('renders company settings', () => {
    render(<SettingsCompanySection />)
    expect(screen.getByText('company settings')).toBeInTheDocument()
  })
})
