import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { SettingsTablesTab } from './SettingsTablesTab'
import { settingsTablesTabMock } from './SettingsTablesTab.mock'

vi.mock('@pages/Settings/facades/useSettingsFacade/useSettingsFacade', () => ({
  useSettingsFacade: () => ({
    unit: { unitSlug: settingsTablesTabMock.unitSlug },
    diningTables: {
      query: {
        tables: settingsTablesTabMock.tables,
        isPending: settingsTablesTabMock.isPending,
      },
      mutations: {
        add: {
          isPending: settingsTablesTabMock.isAdding,
          mutate: vi.fn(),
        },
        toggle: {
          isPending: false,
          variables: settingsTablesTabMock.togglingId,
          mutate: vi.fn(),
        },
        drop: {
          isPending: false,
          variables: settingsTablesTabMock.removingId,
          mutate: vi.fn(),
        },
      },
    },
  }),
}))

describe(SettingsTablesTab.name, () => {
  it('presents the table configuration workflow', () => {
    render(<SettingsTablesTab />)

    expect(
      screen.getByRole('heading', { name: 'Mesas e QR Codes' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Gerar mesas' })
    ).toBeInTheDocument()
  })
})
