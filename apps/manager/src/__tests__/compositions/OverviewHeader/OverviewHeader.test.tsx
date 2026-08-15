import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { OverviewHeader } from '@compositions/OverviewHeader/OverviewHeader'

import { currentTenant } from './OverviewHeader.mock'

vi.mock('@compositions/StoreSign/StoreSign', () => ({
  StoreSign: () => <p>selo da loja</p>,
}))

vi.mock('@utils/greeting', () => ({
  greetingFor: () => 'Bom dia',
  dateFor: () => 'quinta-feira, 1 de janeiro',
}))

describe(OverviewHeader.name, () => {
  it('shows the first name and a link to the tenant store', () => {
    // Arrange / Act
    render(
      <OverviewHeader
        firstName="Marina"
        timezone="America/Sao_Paulo"
        tenant={currentTenant}
      />
    )

    // Assert
    expect(
      screen.getByRole('heading', { name: 'Bom dia, Marina' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Padaria Boa' })
    ).toHaveAttribute('href', 'https://padaria-boa.dev.nino.delivery')
  })

  it('renders with an empty name and no store link with no tenant', () => {
    // Arrange / Act
    render(
      <OverviewHeader firstName="" timezone={null} tenant={null} />
    )

    // Assert
    expect(
      screen.getByRole('heading', { name: 'Bom dia,' })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'Padaria Boa' })
    ).not.toBeInTheDocument()
  })

  it('renders the store sign composition', () => {
    // Arrange / Act
    render(
      <OverviewHeader
        firstName="Marina"
        timezone="America/Sao_Paulo"
        tenant={currentTenant}
      />
    )

    // Assert
    expect(screen.getByText('selo da loja')).toBeInTheDocument()
  })
})
