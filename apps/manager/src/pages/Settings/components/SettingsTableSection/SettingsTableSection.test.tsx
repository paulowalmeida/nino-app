import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SettingsTableSection } from './SettingsTableSection'
import { settingsTableSectionMock } from './SettingsTableSection.mock'

vi.mock('./SettingsTablesTab/SettingsTablesTab', () => ({
  SettingsTablesTab: () => <div>configuração das mesas</div>,
}))

vi.mock('./SettingsServiceFeeTab/SettingsServiceFeeTab', () => ({
  SettingsServiceFeeTab: () => <div>configuração da taxa de serviço</div>,
}))

vi.mock('./SettingsPhysicalTab/SettingsPhysicalTab', () => ({
  SettingsPhysicalTab: () => <div>configuração de comandas físicas</div>,
}))

describe(SettingsTableSection.name, () => {
  it('presents the tables, the service fee and the physical tab paths', async () => {
    const user = userEvent.setup()

    render(<SettingsTableSection />)

    expect(
      screen.getByRole('heading', { name: settingsTableSectionMock.heading })
    ).toBeInTheDocument()
    expect(screen.getByText('configuração das mesas')).toBeInTheDocument()
    expect(
      screen.getByRole('tab', { name: settingsTableSectionMock.physicalTab })
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('tab', { name: settingsTableSectionMock.serviceFeeTab })
    )

    expect(
      screen.getByText('configuração da taxa de serviço')
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('tab', { name: settingsTableSectionMock.physicalTab })
    )

    expect(
      screen.getByText('configuração de comandas físicas')
    ).toBeInTheDocument()
  })
})
