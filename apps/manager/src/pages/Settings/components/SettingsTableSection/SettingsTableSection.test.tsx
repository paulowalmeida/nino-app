import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SettingsTableSection } from './SettingsTableSection'

vi.mock('@pages/Settings/facades/useSettingsFacade/useSettingsFacade', () => ({
  useSettingsFacade: () => ({
    diningTables: {
      query: { tables: [], isPending: false },
      mutations: {
        add: { isPending: false, mutate: vi.fn() },
        toggle: { isPending: false, variables: undefined, mutate: vi.fn() },
      },
    },
  }),
}))

describe(SettingsTableSection.name, () => {
  it('presents table and physical tab configuration paths', () => {
    render(<SettingsTableSection />)

    expect(
      screen.getByRole('heading', { name: 'Salão e comandas' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Mesas e QR Codes' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Comandas físicas' })
    ).toBeInTheDocument()
  })
})
