import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { OverviewHeader } from '@organisms/OverviewHeader/OverviewHeader'
import { useStoreOpen } from '@hooks/store/useStoreOpen'

import { currentTenant } from './OverviewHeader.mock'

vi.mock('@organisms/StoreSign/StoreSign', () => ({
  StoreSign: () => <p>selo da loja</p>,
}))

vi.mock('@hooks/store/useStoreOpen')

vi.mock('@utils/greeting', () => ({
  greetingFor: () => 'Bom dia',
  dateFor: () => 'quinta-feira, 1 de janeiro',
}))

const mockStoreOpen = (isOpen: boolean) =>
  vi.mocked(useStoreOpen).mockReturnValue({
    isOpen,
    isPending: false,
    hasSchedule: true,
  })

describe(OverviewHeader.name, () => {
  it('titles the screen with the store and links to the storefront', () => {
    // Arrange
    mockStoreOpen(true)

    // Act
    render(
      <OverviewHeader
        firstName="Marina"
        timezone="America/Sao_Paulo"
        tenant={currentTenant}
      />
    )

    // Assert
    expect(
      screen.getByRole('heading', { name: 'Padaria Boa' })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver a loja' })).toHaveAttribute(
      'href',
      'https://padaria-boa.dev.nino.delivery'
    )
  })

  it('greets the person by first name above the store name', () => {
    // Arrange
    mockStoreOpen(true)

    // Act
    render(
      <OverviewHeader
        firstName="Marina"
        timezone="America/Sao_Paulo"
        tenant={currentTenant}
      />
    )

    // Assert
    expect(screen.getByText('Bom dia, Marina')).toBeInTheDocument()
    expect(
      screen.getByText('quinta-feira, 1 de janeiro')
    ).toBeInTheDocument()
  })

  it('drops the comma and the store link with no tenant or name', () => {
    // Arrange
    mockStoreOpen(false)

    // Act
    render(<OverviewHeader firstName="" timezone={null} tenant={null} />)

    // Assert
    expect(screen.getByText('Bom dia')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Sua loja' })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'Ver a loja' })
    ).not.toBeInTheDocument()
  })

  it('renders the store sign composition', () => {
    // Arrange
    mockStoreOpen(true)

    // Act
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
