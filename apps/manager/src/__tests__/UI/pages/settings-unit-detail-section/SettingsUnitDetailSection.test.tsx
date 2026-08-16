import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useSaveTenant } from '@hooks/store/useSaveTenant'
import { useSetMainTenant } from '@hooks/store/useSetMainTenant'
import { useTenantDetail } from '@hooks/store/useTenantDetail'

import {
  SettingsUnitDetailSection,
} from '@pages/settings-unit-detail-section/SettingsUnitDetailSection'

import { branchUnit, currentTenant } from './SettingsUnitDetailSection.mock'

vi.mock('@hooks/session/useCurrentTenant')
vi.mock('@hooks/store/useSaveTenant')
vi.mock('@hooks/store/useSetMainTenant')
vi.mock('@hooks/store/useTenantDetail')

const mockHooks = (setMain = vi.fn()) => {
  vi.mocked(useCurrentTenant).mockReturnValue(currentTenant)
  vi.mocked(useTenantDetail).mockReturnValue({
    data: branchUnit,
    isPending: false,
  } as unknown as ReturnType<typeof useTenantDetail>)
  vi.mocked(useSaveTenant).mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  } as unknown as ReturnType<typeof useSaveTenant>)
  vi.mocked(useSetMainTenant).mockReturnValue({
    mutate: setMain,
    isPending: false,
  } as unknown as ReturnType<typeof useSetMainTenant>)
}

describe(SettingsUnitDetailSection.name, () => {
  it('shows the breadcrumb with the current unit name', () => {
    // Arrange
    mockHooks()

    // Act
    render(
      <MemoryRouter>
        <SettingsUnitDetailSection />
      </MemoryRouter>
    )

    // Assert
    expect(
      screen.getByText('Lanchonete do Zé - Centro')
    ).toBeInTheDocument()
  })

  it('promotes the unit to main when confirmed', async () => {
    // Arrange
    const setMain = vi.fn()
    mockHooks(setMain)
    render(
      <MemoryRouter>
        <SettingsUnitDetailSection />
      </MemoryRouter>
    )

    // Act
    await userEvent.click(
      screen.getByRole('button', { name: 'Tornar matriz' })
    )

    // Assert
    expect(setMain).toHaveBeenCalledWith('tenant-1')
  })
})
