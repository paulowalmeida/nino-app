import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router'

import { useAccountNavigationFacade } from '../../facades/useAccountNavigationFacade/useAccountNavigationFacade'

import { AccountNav } from './AccountNav'
import { accountNavMock } from './AccountNav.mock'

vi.mock('../../facades/useAccountNavigationFacade/useAccountNavigationFacade')

const facadeWith = (overrides: Record<string, unknown>) =>
  vi.mocked(useAccountNavigationFacade).mockReturnValue({
    logout: vi.fn(),
    isLoggingOut: false,
    ...overrides,
  } as unknown as ReturnType<typeof useAccountNavigationFacade>)

const renderNav = (initialEntry = '/loja/conta/dados') =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AccountNav />
    </MemoryRouter>
  )

describe('AccountNav', () => {
  it('marks the "em breve" sections instead of a count', () => {
    // Arrange
    facadeWith({})

    // Act
    renderNav()

    // Assert
    expect(screen.getAllByText('em breve')).toHaveLength(
      accountNavMock.soonSections
    )
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
