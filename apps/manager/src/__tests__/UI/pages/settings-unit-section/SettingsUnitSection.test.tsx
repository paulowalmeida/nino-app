import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { useSubscription } from '@hooks/account/useSubscription'
import { useCompanyGroups } from '@hooks/session/useCompanyGroups'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useRemoveTenant } from '@hooks/store/useRemoveTenant'
import { useTenantDetail } from '@hooks/store/useTenantDetail'

import {
  SettingsUnitSection,
} from '@pages/settings-unit-section/SettingsUnitSection'

import {
  activeSubscription,
  companyGroups,
  hereUnit,
  tenantDetail,
} from './SettingsUnitSection.mock'

vi.mock('@hooks/account/useSubscription')
vi.mock('@hooks/session/useCompanyGroups')
vi.mock('@hooks/session/useCurrentTenant')
vi.mock('@hooks/store/useRemoveTenant')
vi.mock('@hooks/store/useTenantDetail')

const mockHooks = () => {
  vi.mocked(useCurrentTenant).mockReturnValue(hereUnit)
  vi.mocked(useCompanyGroups).mockReturnValue(companyGroups)
  vi.mocked(useTenantDetail).mockReturnValue({
    data: tenantDetail,
  } as unknown as ReturnType<typeof useTenantDetail>)
  vi.mocked(useRemoveTenant).mockReturnValue({
    mutate: vi.fn(),
    isPending: false,
  } as unknown as ReturnType<typeof useRemoveTenant>)
  vi.mocked(useSubscription).mockReturnValue({
    data: activeSubscription,
    isPending: false,
  } as unknown as ReturnType<typeof useSubscription>)
}

describe(SettingsUnitSection.name, () => {
  it('lists every unit of the company, marking the current one', () => {
    // Arrange
    mockHooks()

    // Act
    render(
      <MemoryRouter>
        <SettingsUnitSection />
      </MemoryRouter>
    )

    // Assert
    expect(
      screen.getByText('Lanchonete do Zé - Centro')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Lanchonete do Zé - Norte')
    ).toBeInTheDocument()
    expect(screen.getByText('aqui')).toBeInTheDocument()
  })

  it('shows the plan limit reached message when the plan is full', () => {
    // Arrange
    mockHooks()
    vi.mocked(useSubscription).mockReturnValue({
      data: {
        ...activeSubscription,
        plan: { ...activeSubscription.plan, maxTenants: 1 },
      },
      isPending: false,
    } as unknown as ReturnType<typeof useSubscription>)

    // Act
    render(
      <MemoryRouter>
        <SettingsUnitSection />
      </MemoryRouter>
    )

    // Assert
    expect(
      screen.getByText(/Para abrir outra, fale com a/)
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'Abrir unidade' })
    ).not.toBeInTheDocument()
  })
})
