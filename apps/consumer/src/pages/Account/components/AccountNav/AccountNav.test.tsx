import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router'

import { useAccountFacade } from '@pages/account/facades/useAccountFacade/useAccountFacade'

import { AccountNav } from './AccountNav'
import { accountNavMock } from './AccountNav.mock'

vi.mock('@pages/account/facades/useAccountFacade/useAccountFacade')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useAccountFacade).mockReturnValue({
    orders: accountNavMock.orders,
    addresses: accountNavMock.addresses,
    logout: vi.fn(),
    isLoggingOut: false,
    ...overrides,
  } as unknown as ReturnType<typeof useAccountFacade>)

const renderNav = (initialEntry = '/loja/conta/dados') =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AccountNav />
    </MemoryRouter>
  )

describe('AccountNav', () => {
  it('shows the count of orders and addresses next to each section', () => {
    // Arrange
    facadeWith({})

    // Act
    renderNav()

    // Assert
    expect(screen.getAllByText('1')).toHaveLength(2)
  })

  it('marks the "em breve" sections instead of a count', () => {
    // Arrange
    facadeWith({})

    // Act
    renderNav()

    // Assert
    expect(screen.getAllByText('em breve')).toHaveLength(3)
  })

  it('calls the facade logout command when the button is pressed', () => {
    // Arrange
    const logout = vi.fn()
    facadeWith({ logout })

    // Act
    renderNav()
    fireEvent.click(screen.getByRole('button', { name: 'Sair da conta' }))

    // Assert
    expect(logout).toHaveBeenCalledTimes(1)
  })

  it('disables the logout button while logging out', () => {
    // Arrange
    facadeWith({ isLoggingOut: true })

    // Act
    renderNav()

    // Assert
    expect(screen.getByRole('button', { name: 'Saindo…' })).toBeDisabled()
  })
})
