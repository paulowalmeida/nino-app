import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useSaveSettings } from '@hooks/settings/useSaveSettings'
import { useSettings } from '@hooks/settings/useSettings'

import {
  SettingsServiceSection,
} from '@pages/settings-service-section/SettingsServiceSection'

import { baseSettings, currentTenant } from './SettingsServiceSection.mock'

vi.mock('@hooks/session/useCurrentTenant')
vi.mock('@hooks/settings/useSaveSettings')
vi.mock('@hooks/settings/useSettings')

describe(SettingsServiceSection.name, () => {
  it('seeds the form with the settings already saved', () => {
    // Arrange
    vi.mocked(useCurrentTenant).mockReturnValue(currentTenant)
    vi.mocked(useSettings).mockReturnValue({
      data: baseSettings,
      isPending: false,
    } as unknown as ReturnType<typeof useSettings>)
    vi.mocked(useSaveSettings).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useSaveSettings>)

    // Act
    render(<SettingsServiceSection />)

    // Assert
    expect(screen.getByLabelText('Pedido mínimo')).toHaveValue('20,00')
  })

  it('shows nothing while the settings are pending', () => {
    // Arrange
    vi.mocked(useCurrentTenant).mockReturnValue(currentTenant)
    vi.mocked(useSettings).mockReturnValue({
      data: undefined,
      isPending: true,
    } as unknown as ReturnType<typeof useSettings>)
    vi.mocked(useSaveSettings).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as ReturnType<typeof useSaveSettings>)

    // Act
    render(<SettingsServiceSection />)

    // Assert
    expect(screen.queryByText('Como a loja atende')).not.toBeInTheDocument()
  })
})
