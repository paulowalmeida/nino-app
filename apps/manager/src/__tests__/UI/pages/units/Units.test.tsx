import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import type { AuthUser } from '@custom_types/auth/auth-user'
import { useLogout } from '@hooks/session/useLogout'
import { useSessionStore } from '@states/useSessionStore'

import { Units } from '@pages/units/Units'

import { userWithName } from './Units.mock'

vi.mock('@hooks/session/useLogout')
vi.mock('@states/useSessionStore')

vi.mock('@organisms/FirstStoreForm/FirstStoreForm', () => ({
  FirstStoreForm: ({
    onChange,
  }: {
    onChange?: (values: { customName?: string }) => void
  }) => (
    <button onClick={() => onChange?.({ customName: 'Padaria Boa' })}>
      digitar nome
    </button>
  ),
}))

const mockSession = (user: Pick<AuthUser, 'id' | 'name'> | null) =>
  vi.mocked(useSessionStore).mockImplementation((selector) =>
    selector({
      user: user as AuthUser | null,
      memberships: [],
      currentTenantId: null,
      setSession: vi.fn(),
      setCurrentTenant: vi.fn(),
      clear: vi.fn(),
      load: vi.fn(),
    })
  )

describe(Units.name, () => {
  it('greets the user by their first name when session has a user', () => {
    // Arrange
    mockSession(userWithName)
    vi.mocked(useLogout).mockReturnValue({ logout: vi.fn() })

    // Act
    render(<Units />, { wrapper: MemoryRouter })

    // Assert
    expect(screen.getByText('Sua primeira loja, Paulo')).toBeInTheDocument()
  })

  it('falls back to a generic title with no session user', () => {
    // Arrange
    mockSession(null)
    vi.mocked(useLogout).mockReturnValue({ logout: vi.fn() })

    // Act
    render(<Units />, { wrapper: MemoryRouter })

    // Assert
    expect(screen.getByText('Sua primeira loja')).toBeInTheDocument()
  })

  it('logs out through useLogout when the top bar action fires', async () => {
    // Arrange
    mockSession(userWithName)
    const logout = vi.fn()
    vi.mocked(useLogout).mockReturnValue({ logout })
    render(<Units />, { wrapper: MemoryRouter })

    // Act
    await userEvent.click(screen.getByRole('button', { name: 'Sair' }))

    // Assert
    expect(logout).toHaveBeenCalled()
  })

  it('reflects the typed name in the store preview', async () => {
    // Arrange
    mockSession(userWithName)
    vi.mocked(useLogout).mockReturnValue({ logout: vi.fn() })
    render(<Units />, { wrapper: MemoryRouter })

    // Act
    await userEvent.click(screen.getByText('digitar nome'))

    // Assert
    expect(screen.getByText('Padaria Boa')).toBeInTheDocument()
  })
})
