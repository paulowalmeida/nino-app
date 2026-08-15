import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { AuthUser } from '@custom_types/auth/auth-user'
import type { Membership } from '@custom_types/auth/membership'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useSessionStore } from '@states/useSessionStore'

import { Overview } from '@pages/overview/Overview'

import { currentTenant, sessionUser } from './Overview.mock'

vi.mock('@hooks/session/useCurrentTenant')
vi.mock('@states/useSessionStore')

vi.mock('@compositions/OverviewHeader/OverviewHeader', () => ({
  OverviewHeader: ({
    firstName,
    tenant,
  }: {
    firstName: string
    tenant: Membership | null
  }) => (
    <p>
      cabeçalho de {firstName || 'visitante'} — loja{' '}
      {tenant?.tenantName ?? 'nenhuma'}
    </p>
  ),
}))
vi.mock('@compositions/DayTally/DayTally', () => ({
  DayTally: () => <p>resumo do dia</p>,
}))
vi.mock('@compositions/PauseSwitch/PauseSwitch', () => ({
  PauseSwitch: () => <p>pausar loja</p>,
}))
vi.mock('@compositions/QueueBoard/QueueBoard', () => ({
  QueueBoard: () => <p>fila de pedidos</p>,
}))
vi.mock('@compositions/SalesTrend/SalesTrend', () => ({
  SalesTrend: () => <p>tendência de vendas</p>,
}))
vi.mock('@compositions/TopProducts/TopProducts', () => ({
  TopProducts: () => <p>produtos mais vendidos</p>,
}))
vi.mock('@compositions/TopCustomers/TopCustomers', () => ({
  TopCustomers: () => <p>quem mais compra</p>,
}))

const mockUser = (user: Pick<AuthUser, 'name' | 'timezone'> | null) =>
  vi
    .mocked(useSessionStore)
    .mockImplementation((selector) =>
      selector({ user } as ReturnType<typeof useSessionStore.getState>)
    )

const renderOverview = () => render(<Overview />)

describe(Overview.name, () => {
  it('passes the first name and tenant down to the header', () => {
    // Arrange
    mockUser(sessionUser)
    vi.mocked(useCurrentTenant).mockReturnValue(currentTenant)

    // Act
    renderOverview()

    // Assert
    expect(
      screen.getByText('cabeçalho de Marina — loja Padaria Boa')
    ).toBeInTheDocument()
  })

  it('falls back to an empty name and no tenant with no session', () => {
    // Arrange
    mockUser(null)
    vi.mocked(useCurrentTenant).mockReturnValue(null)

    // Act
    renderOverview()

    // Assert
    expect(
      screen.getByText('cabeçalho de visitante — loja nenhuma')
    ).toBeInTheDocument()
  })

  it('renders every dashboard composition', () => {
    // Arrange
    mockUser(sessionUser)
    vi.mocked(useCurrentTenant).mockReturnValue(currentTenant)

    // Act
    renderOverview()

    // Assert
    expect(screen.getByText('resumo do dia')).toBeInTheDocument()
    expect(screen.getByText('pausar loja')).toBeInTheDocument()
    expect(screen.getByText('fila de pedidos')).toBeInTheDocument()
    expect(screen.getByText('tendência de vendas')).toBeInTheDocument()
    expect(screen.getByText('produtos mais vendidos')).toBeInTheDocument()
    expect(screen.getByText('quem mais compra')).toBeInTheDocument()
  })
})
