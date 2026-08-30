import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SettingsTableSection } from './SettingsTableSection'

vi.mock('./SettingsTablesTab/SettingsTablesTab', () => ({
  SettingsTablesTab: () => <div>configuração das mesas</div>,
}))

vi.mock('./SettingsPhysicalTab/SettingsPhysicalTab', () => ({
  SettingsPhysicalTab: () => <div>configuração de comandas físicas</div>,
}))

describe(SettingsTableSection.name, () => {
  it('presents table and physical tab configuration paths', async () => {
    const user = userEvent.setup()

    render(<SettingsTableSection />)

    expect(
      screen.getByRole('heading', { name: 'Salão e comandas' })
    ).toBeInTheDocument()
    expect(screen.getByText('configuração das mesas')).toBeInTheDocument()
    expect(
      screen.getByRole('tab', { name: 'Comandas físicas' })
    ).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Comandas físicas' }))

    expect(
      screen.getByText('configuração de comandas físicas')
    ).toBeInTheDocument()
  })
})
